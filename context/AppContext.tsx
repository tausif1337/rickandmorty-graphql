/**
 * AppContext.tsx - Global Storage for Our App
 * 
 * This file creates a "global storage box" that any component in our app can access.
 * Think of it like a shared notebook that everyone in the app can read and write to.
 * 
 * WHAT THIS FILE DOES:
 * 1. Creates a Context (a global storage system)
 * 2. Provides functions to read and write favorites, search text, and page numbers
 * 3. Makes these available to all components in the app
 * 
 * WHY WE NEED THIS:
 * Instead of passing data through many components (like a game of telephone),
 * we store it in one place that everyone can access directly.
 */

// STEP 1: Import React tools we need
import React, { createContext, useContext, ReactNode, useState } from "react";

// STEP 2: Import the reactive variables and helper functions from apolloClient
// These are the storage boxes we created earlier
import {
  favoriteCharactersVar,
  searchFilterVar,
  currentPageVar,
  addFavorite,
  removeFavorite,
} from "../config/apolloClient";

/**
 * AppContextType - A "Contract" That Defines What Data We Store
 * 
 * This is like a table of contents that lists everything available in our context.
 * TypeScript uses this to make sure we use the right types everywhere.
 * 
 * Think of it like a menu at a restaurant - it tells you what's available.
 */
interface AppContextType {
  favorites: string[];                              // List of favorite character IDs
  addToFavorites: (id: string) => void;            // Function to add a favorite
  removeFromFavorites: (id: string) => void;       // Function to remove a favorite
  isFavorite: (id: string) => boolean;             // Function to check if something is a favorite
  searchFilter: string;                             // The search text the user typed
  setSearchFilter: (filter: string) => void;       // Function to update search text
  currentPage: number;                              // Which page of characters we're viewing
  setCurrentPage: (page: number) => void;          // Function to change the page
}

/**
 * Create the Context - This is the actual storage box
 * 
 * createContext creates an empty box. We'll fill it with data later.
 * The "undefined" means it starts empty (no data yet).
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider - The Component That Fills the Storage Box
 * 
 * This component wraps our entire app and provides all the data and functions
 * to every component inside it.
 * 
 * Think of it like a parent giving all their children access to a shared toy box.
 * 
 * @param children - All the components inside this provider (like CharacterList)
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  /**
   * useState - React's Way of Storing Data That Can Change
   * 
   * useState is like a special box that, when you change its contents,
   * automatically updates everything on the screen that uses it.
   * 
   * We use useState here to sync with the reactive variables from Apollo.
   * This ensures the screen updates when data changes.
   */
  
  // Store the list of favorite character IDs
  // Starts with whatever is in favoriteCharactersVar
  const [favorites, setFavorites] = useState<string[]>(favoriteCharactersVar());
  
  // Store the search text the user typed
  // Starts with whatever is in searchFilterVar
  const [searchFilter, setSearchFilterState] = useState<string>(searchFilterVar());
  
  // Store the current page number
  // Starts with whatever is in currentPageVar
  const [currentPage, setCurrentPageState] = useState<number>(currentPageVar());

  /**
   * addToFavorites - Adds a character to favorites
   * 
   * This function:
   * 1. Updates the reactive variable (Apollo's storage)
   * 2. Updates the React state (triggers screen update)
   */
  const addToFavorites = (id: string) => {
    // Add to Apollo's storage
    addFavorite(id);
    // Update React state to trigger a screen refresh
    setFavorites(favoriteCharactersVar());
  };

  /**
   * removeFromFavorites - Removes a character from favorites
   * 
   * This function:
   * 1. Updates the reactive variable (Apollo's storage)
   * 2. Updates the React state (triggers screen update)
   */
  const removeFromFavorites = (id: string) => {
    // Remove from Apollo's storage
    removeFavorite(id);
    // Update React state to trigger a screen refresh
    setFavorites(favoriteCharactersVar());
  };

  /**
   * isFavorite - Checks if a character is in the favorites list
   * 
   * @param id - The character's ID to check
   * @returns true if the character is favorited, false otherwise
   * 
   * includes() checks if an item exists in an array
   */
  const isFavorite = (id: string) => favorites.includes(id);

  /**
   * setSearchFilter - Updates the search text
   * 
   * When the user types in the search box, this function:
   * 1. Updates the search text in Apollo's storage
   * 2. Updates the React state
   * 3. Resets to page 1 (because new search = start from beginning)
   */
  const setSearchFilter = (filter: string) => {
    // Update Apollo's storage
    searchFilterVar(filter);
    // Update React state
    setSearchFilterState(filter);
    // Reset to page 1 when searching (start from the beginning)
    currentPageVar(1);
    setCurrentPageState(1);
  };

  /**
   * setCurrentPage - Changes which page of characters we're viewing
   * 
   * @param page - The page number to go to
   */
  const setCurrentPage = (page: number) => {
    // Update Apollo's storage
    currentPageVar(page);
    // Update React state
    setCurrentPageState(page);
  };

  /**
   * Return the Provider Component
   * 
   * This wraps all children and gives them access to all the data and functions
   * we defined above. It's like opening the toy box so all children can play.
   */
  return (
    <AppContext.Provider
      value={{
        // All the data and functions we want to share
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        searchFilter,
        setSearchFilter,
        currentPage,
        setCurrentPage,
      }}
    >
      {/* children are all the components inside this provider */}
      {children}
    </AppContext.Provider>
  );
};

/**
 * useAppContext - A Hook to Access the Context
 * 
 * This is like a key to open the storage box. Any component can use this
 * to get access to all the data and functions we stored.
 * 
 * HOW TO USE IT:
 * const { favorites, addToFavorites } = useAppContext();
 * 
 * @returns All the data and functions from AppContext
 * @throws Error if used outside of AppProvider
 */
export const useAppContext = () => {
  // Get the context (the storage box)
  const context = useContext(AppContext);
  
  // Safety check: Make sure we're inside an AppProvider
  // If not, throw an error with a helpful message
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  
  // Return all the data and functions
  return context;
};

