/**
 * apolloClient.ts - Setting Up Our Connection to the Internet
 * 
 * This file is like setting up a phone line to call a server on the internet.
 * The server has all the character data from Rick and Morty.
 * 
 * WHAT THIS FILE DOES:
 * 1. Creates a connection to the Rick and Morty GraphQL server
 * 2. Sets up storage for favorite characters, search text, and page numbers
 * 3. Creates helper functions to add/remove favorites
 */

// STEP 1: Import the tools we need from Apollo Client
// These are like special tools that help us talk to the server
import { ApolloClient, InMemoryCache, HttpLink, makeVar } from "@apollo/client";

/**
 * REACTIVE VARIABLES - Global Storage Boxes
 * 
 * Think of these like global sticky notes that the whole app can read and write to.
 * When you change them, any component watching them automatically updates!
 * 
 * makeVar() creates a "reactive variable" - a special storage box that
 * automatically notifies components when its value changes.
 */

// Storage box for favorite character IDs (list of strings)
// Starts empty: []
export const favoriteCharactersVar = makeVar<string[]>([]);

// Storage box for search text (what the user types to search)
// Starts empty: ""
export const searchFilterVar = makeVar<string>("");

// Storage box for current page number (which page of characters we're viewing)
// Starts at page 1
export const currentPageVar = makeVar<number>(1);

/**
 * HELPER FUNCTIONS - Tools to Work With Favorites
 * 
 * These are like helper tools that make it easier to add/remove favorites.
 * Instead of writing the same code over and over, we create functions!
 */

/**
 * addFavorite - Adds a character ID to the favorites list
 * 
 * @param id - The character's ID (like "1", "2", "3", etc.)
 * 
 * How it works:
 * 1. Get the current list of favorites
 * 2. Check if the ID is already in the list (to avoid duplicates)
 * 3. If not, add it to the list
 * 4. Save the updated list back to the storage box
 */
export const addFavorite = (id: string) => {
  // Get the current list of favorite IDs
  const current = favoriteCharactersVar();
  
  // Check if this ID is NOT already in the list
  if (!current.includes(id)) {
    // If not, create a new list with the old favorites + the new one
    // [...current, id] means "take all items from current, then add id"
    favoriteCharactersVar([...current, id]);
  }
};

/**
 * removeFavorite - Removes a character ID from the favorites list
 * 
 * @param id - The character's ID to remove
 * 
 * How it works:
 * 1. Get the current list of favorites
 * 2. Filter out (remove) the ID we don't want
 * 3. Save the updated list back to the storage box
 */
export const removeFavorite = (id: string) => {
  // Get current favorites, filter out the one we want to remove
  // filter() creates a new list with only items that pass the test
  // (i) => i !== id means "keep only items that are NOT equal to id"
  favoriteCharactersVar(favoriteCharactersVar().filter((i) => i !== id));
};

/**
 * APOLLO CLIENT - The Connection to the Server
 * 
 * This is like setting up a phone that can call the Rick and Morty server.
 * 
 * ApolloClient is the main tool that:
 * - Sends requests to the server (like "give me characters")
 * - Receives responses from the server (the character data)
 * - Stores (caches) the data so we don't have to ask for it again
 * 
 * HttpLink tells Apollo WHERE to send requests (the server's address)
 * InMemoryCache tells Apollo to remember data we've already fetched
 */
export const client = new ApolloClient({
  // link: Where to send requests (the server's address)
  link: new HttpLink({
    // This is the Rick and Morty GraphQL API address
    // It's like a phone number for the server
    uri: "https://rickandmortyapi.com/graphql",
  }),
  // cache: Store data in memory so we don't have to fetch it again
  // Think of it like a notebook where we write down what we've already asked for
  cache: new InMemoryCache(),
});