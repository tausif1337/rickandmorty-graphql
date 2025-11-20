/**
 * App.tsx - The Main Entry Point of Our App
 * 
 * Think of this file as the "home" of your app. It's the first thing that runs
 * when your app starts. This file sets up all the important tools your app needs.
 * 
 * WHAT THIS FILE DOES:
 * 1. Imports all the pieces we need (like importing tools from a toolbox)
 * 2. Wraps everything in "providers" (think of them as containers that give
 *    special powers to everything inside)
 * 3. Shows the CharacterList component (the main screen users see)
 */

// STEP 1: Import statements - These bring in code from other files
// Think of imports like borrowing tools from other people's toolboxes

// StyleSheet helps us make things look pretty (colors, sizes, etc.)
import { StyleSheet } from "react-native";

// SafeAreaProvider and SafeAreaView make sure our content doesn't go under the phone's
// notch, status bar, or home indicator
// SafeAreaProvider: Sets up the safe area system (must wrap the entire app)
// SafeAreaView: A container that respects safe areas (the actual content area)
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// ApolloProvider is like a "magic box" that lets all components inside it
// talk to the GraphQL server (the place where character data lives)
import { ApolloProvider } from "@apollo/client/react";

// client is our connection to the GraphQL server
// It's like a phone that lets us call the server and ask for data
import { client } from "./config/apolloClient";

// AppProvider is our own custom "magic box" that stores app-wide data
// like favorites, search text, and current page number
import { AppProvider } from "./context/AppContext";

// CharacterList is the main screen that shows all the characters
import CharacterList from "./components/CharacterList";

/**
 * App Component - The Main Function
 * 
 * This is the most important function in our app. It returns (shows) everything
 * the user sees on their screen.
 * 
 * Think of it like building a house:
 * - SafeAreaProvider = The foundation (sets up safe area detection)
 * - ApolloProvider = The framework (connects to the internet/server)
 * - AppProvider = The walls (stores app data)
 * - SafeAreaView = The roof (makes sure content fits on screen)
 * - CharacterList = The furniture (the actual content users see)
 * 
 * SAFE AREA EXPLANATION:
 * Modern phones have notches, status bars, and home indicators that can cover content.
 * Safe areas ensure our content is always visible and not hidden behind these elements.
 * - Top edge: Avoids the notch/status bar at the top
 * - Bottom edge: Avoids the home indicator at the bottom
 */
export default function App() {
  // The "return" statement is like saying "show this on the screen"
  return (
    // SafeAreaProvider MUST be the outermost wrapper
    // It sets up the safe area system so all SafeAreaView components work properly
    // Think of it as turning on the "safe area detection" feature
    <SafeAreaProvider>
      {/* ApolloProvider wraps everything - it gives all components inside
          the ability to fetch data from the GraphQL server */}
      <ApolloProvider client={client}>
        {/* AppProvider wraps everything - it gives all components inside
            the ability to access favorites, search, and page data */}
        <AppProvider>
          {/* SafeAreaView makes sure our content doesn't go under:
              - The notch (the black bar at the top of some phones like iPhone X+)
              - The status bar (time, battery, signal at the top)
              - The home indicator (the bar at the bottom of newer iPhones)
              
              edges={["top", "bottom"]} means:
              - Apply safe area padding to the top (avoid notch/status bar)
              - Apply safe area padding to the bottom (avoid home indicator)
              - Don't apply to left/right (we want full width) */}
          <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            {/* CharacterList is the actual screen users see - it shows
                the list of characters from Rick and Morty */}
            <CharacterList />
          </SafeAreaView>
        </AppProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}

/**
 * Styles - How Things Look
 * 
 * This is like a style guide that tells our app how to look.
 * Think of it like choosing colors and sizes for your house.
 * 
 * "flex: 1" means "take up all available space"
 * "backgroundColor" is the background color (light gray)
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,              // Take up the full screen
    backgroundColor: "#f5f5f5",  // Light gray background color
  },
});