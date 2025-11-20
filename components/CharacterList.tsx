/**
 * CharacterList.tsx - The Main Screen Users See
 * 
 * This is the most important component! It's what users actually see and interact with.
 * Think of it like the main page of a website - it shows the list of characters.
 * 
 * WHAT THIS COMPONENT DOES:
 * 1. Shows a search box where users can type to find characters
 * 2. Displays a list of characters with their pictures and names
 * 3. Lets users favorite/unfavorite characters (click the heart)
 * 4. Shows Previous/Next buttons to navigate between pages
 */

// STEP 1: Import React Native components (the building blocks for our screen)
// These are like LEGO pieces - we combine them to build our screen
import {
  FlatList,          // A scrollable list (like a phone's contact list)
  StyleSheet,        // Tool to style our components (colors, sizes, etc.)
  View,              // A container (like a box that holds other things)
  Text,              // Displays text on the screen
  Image,             // Displays images (character pictures)
  TextInput,         // A text box where users can type (the search box)
  TouchableOpacity,  // A button that users can press
} from "react-native";

// STEP 2: Import Apollo Client's useQuery hook
// This is like a tool that asks the server for data
import { useQuery } from "@apollo/client/react";

// STEP 3: Import our GraphQL query (the question we ask the server)
import { GET_CHARACTERS_PAGINATED } from "../queries/characters";

// STEP 4: Import our custom hook to access app-wide data
import { useAppContext } from "../context/AppContext";

/**
 * TYPE DEFINITIONS - Telling TypeScript What Our Data Looks Like
 * 
 * Think of types like labels on boxes - they tell us what's inside.
 * TypeScript uses these to catch mistakes before the app runs.
 */

// What a single character looks like
type Character = {
  id: string;        // Unique ID (like "1", "2", "3")
  name: string;      // Character's name (like "Rick Sanchez")
  image: string;    // URL to the character's picture
  status?: string;  // "Alive", "Dead", or "Unknown" (the ? means optional)
  species?: string; // "Human", "Alien", etc. (the ? means optional)
};

// What the server sends back when we ask for characters
type CharactersData = {
  characters: {
    info: {
      pages: number;      // Total number of pages
      next: number | null; // Next page number (or null if no next page)
      prev: number | null; // Previous page number (or null if no previous page)
    };
    results: Character[]; // The actual list of characters
  };
};

/**
 * CharacterList Component - The Main Function
 * 
 * This function returns (shows) everything the user sees on the screen.
 * It's like a recipe - we follow the steps to create the screen.
 */
export default function CharacterList() {
  /**
   * STEP 1: Get Data from Context (Our Global Storage)
   * 
   * useAppContext() is like opening a shared notebook and reading from it.
   * We get all the data and functions we need:
   * - searchFilter: What the user typed in the search box
   * - setSearchFilter: Function to update the search text
   * - currentPage: Which page we're viewing (1, 2, 3, etc.)
   * - setCurrentPage: Function to change the page
   * - isFavorite: Function to check if a character is favorited
   * - addToFavorites: Function to add a character to favorites
   * - removeFromFavorites: Function to remove a character from favorites
   */
  const {
    searchFilter,
    setSearchFilter,
    currentPage,
    setCurrentPage,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
  } = useAppContext();

  /**
   * STEP 2: Ask the Server for Character Data
   * 
   * useQuery is like making a phone call to the server and asking:
   * "Hey, give me the characters for page X, and filter by name Y"
   * 
   * It returns:
   * - data: The characters we got back (or undefined if still loading)
   */
  const { data } = useQuery<CharactersData>(
    GET_CHARACTERS_PAGINATED, // The question we're asking
    {
      // variables: The parameters we're sending with our question
      variables: {
        page: currentPage,                    // Which page we want
        filter: searchFilter || undefined,    // Search text (or nothing if empty)
      },
      errorPolicy: "all", // Even if there's an error, still show what data we have
    }
  );

  /**
   * STEP 3: Extract the Data We Need
   * 
   * The server sends back data in a specific format. We extract what we need:
   * - characters: The list of characters
   * - info: Information about pagination (next page, previous page, etc.)
   * 
   * The "?" and "||" are safety checks:
   * - data?.characters means "if data exists, get characters, otherwise undefined"
   * - || [] means "if the left side is empty/undefined, use [] instead"
   */
  const characters = data?.characters?.results || [];
  const info = data?.characters?.info;

  // Limit to 2 pages for simplicity (you can change this number)
  const maxPages = 2;

  // Check if we can go to the next page
  // hasNext is true if: there's a next page AND we haven't reached maxPages
  const hasNext = info?.next !== null && currentPage < maxPages;

  // Check if we can go to the previous page
  // hasPrev is true if: there's a previous page
  const hasPrev = info?.prev !== null;

  /**
   * STEP 4: Show the Main Screen
   * 
   * Display the full screen with:
   * - Search box
   * - List of characters
   * - Previous/Next buttons
   */
  return (
    <View style={styles.container}>
      {/* SEARCH BOX */}
      {/* TextInput is like a text box where users can type */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search characters..." // Hint text shown when box is empty
        value={searchFilter}                // The current search text
        onChangeText={setSearchFilter}      // When user types, update the search text
      />

      {/* CHARACTER LIST */}
      {/* FlatList is like a scrollable list - perfect for showing many items */}
      <FlatList
        data={characters} // The list of characters to show
        keyExtractor={(item) => item.id} // Each item needs a unique key (we use the ID)
        renderItem={({ item }) => (
          // For each character, show a card with their info
          <View style={styles.card}>
            {/* Character's picture */}
            <Image source={{ uri: item.image }} style={styles.image} />
            
            {/* Character's info (name, status, species) */}
            <View style={styles.content}>
              {/* Character's name */}
              <Text style={styles.name}>{item.name}</Text>
              
              {/* Status and species (only show if they exist) */}
              {item.status && (
                <Text style={styles.status}>
                  {item.status} • {item.species}
                </Text>
              )}
              
              {/* FAVORITE BUTTON */}
              {/* TouchableOpacity is a button users can press */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => {
                  // When pressed, check if it's already a favorite
                  if (isFavorite(item.id)) {
                    // If yes, remove it from favorites
                    removeFromFavorites(item.id);
                  } else {
                    // If no, add it to favorites
                    addToFavorites(item.id);
                  }
                }}
              >
                {/* Show red heart if favorited, white heart if not */}
                <Text>{isFavorite(item.id) ? "❤️" : "🤍"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* PAGINATION CONTROLS */}
      {/* Only show pagination if we have page info */}
      {info && (
        <View style={styles.pagination}>
          {/* PREVIOUS BUTTON */}
          <TouchableOpacity
            style={[styles.button, !hasPrev && styles.buttonDisabled]}
            onPress={() => {
              // When pressed, go to previous page (if we can)
              if (hasPrev && info.prev) {
                setCurrentPage(info.prev);
              }
            }}
            disabled={!hasPrev} // Disable button if we can't go back
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>

          {/* PAGE NUMBER DISPLAY */}
          <Text style={styles.pageText}>
            Page {currentPage} / {maxPages}
          </Text>

          {/* NEXT BUTTON */}
          <TouchableOpacity
            style={[styles.button, !hasNext && styles.buttonDisabled]}
            onPress={() => {
              // When pressed, go to next page (if we can)
              if (hasNext && currentPage < maxPages) {
                setCurrentPage(currentPage + 1);
              }
            }}
            disabled={!hasNext} // Disable button if we can't go forward
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/**
 * STYLES - How Everything Looks
 * 
 * StyleSheet.create() is like a style guide that tells each component
 * how to look (colors, sizes, spacing, etc.).
 * 
 * Think of it like choosing paint colors and furniture for your house.
 */
const styles = StyleSheet.create({
  // Main container (the whole screen)
  container: {
    flex: 1,                    // Take up all available space
    backgroundColor: "#f5f5f5", // Light gray background
  },
  
  // Search input box
  searchInput: {
    backgroundColor: "#fff",    // White background
    padding: 12,                // Space inside the box
    margin: 16,                 // Space around the box
    borderRadius: 8,            // Rounded corners
    fontSize: 16,               // Text size
  },
  
  // Character card (the box around each character)
  card: {
    backgroundColor: "#fff",    // White background
    marginHorizontal: 16,      // Space on left and right
    marginVertical: 8,          // Space on top and bottom
    borderRadius: 8,            // Rounded corners
    overflow: "hidden",         // Hide anything that goes outside the card
  },
  
  // Character image
  image: {
    width: "100%",              // Full width of the card
    height: 200,                // 200 pixels tall
  },
  
  // Content area (name, status, favorite button)
  content: {
    padding: 16,                // Space inside the content area
  },
  
  // Character name
  name: {
    fontSize: 18,               // Large text
    fontWeight: "bold",         // Bold text
    marginBottom: 4,            // Small space below
  },
  
  // Status and species text
  status: {
    fontSize: 14,               // Medium text
    color: "#666",              // Gray color
  },
  
  // Favorite button
  favoriteButton: {
    marginTop: 8,               // Space above the button
    alignSelf: "flex-start",    // Align to the left
  },
  
  // Pagination container (Previous/Next buttons area)
  pagination: {
    flexDirection: "row",        // Arrange items in a row (side by side)
    justifyContent: "space-between", // Space items evenly
    alignItems: "center",       // Center items vertically
    padding: 16,                // Space inside
    backgroundColor: "#fff",    // White background
    borderTopWidth: 1,          // Top border (1 pixel thick)
    borderTopColor: "#ddd",     // Light gray border color
  },
  
  // Button (Previous/Next buttons)
  button: {
    backgroundColor: "#3498db", // Blue background
    paddingHorizontal: 20,      // Space on left and right
    paddingVertical: 10,        // Space on top and bottom
    borderRadius: 8,            // Rounded corners
  },
  
  // Disabled button (when you can't click it)
  buttonDisabled: {
    backgroundColor: "#ccc",    // Gray background (looks disabled)
  },
  
  // Button text
  buttonText: {
    color: "#fff",              // White text
    fontWeight: "600",          // Semi-bold text
  },
  
  // Page number text
  pageText: {
    fontSize: 16,               // Medium text
    fontWeight: "600",          // Semi-bold text
  },
});
