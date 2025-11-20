/**
 * characters.ts - Questions We Ask the Server
 * 
 * This file contains the "questions" (queries) we send to the GraphQL server.
 * Think of it like a menu at a restaurant - we're ordering what data we want.
 * 
 * WHAT THIS FILE DOES:
 * Defines a GraphQL query that asks the server for character data.
 * 
 * GraphQL is like a smart waiter - you tell it exactly what you want,
 * and it brings back only that data (not extra stuff you don't need).
 */

// Import gql (GraphQL) - this is a tool that helps us write GraphQL queries
import { gql } from "@apollo/client";

/**
 * GET_CHARACTERS_PAGINATED - Our Main Query
 * 
 * This is like a form we fill out to ask the server for characters.
 * 
 * What we're asking for:
 * - $page: Which page of characters we want (like page 1, 2, 3...)
 * - $filter: Optional search text to filter characters by name
 * 
 * What we get back:
 * - info: Information about pagination (how many pages, next page, previous page)
 * - results: The actual list of characters with their details
 *   - id: Unique number for each character
 *   - name: Character's name
 *   - image: URL to the character's picture
 *   - status: Alive, Dead, or Unknown
 *   - species: Human, Alien, etc.
 * 
 * The "!" after Int means "required" - we MUST provide a page number
 * The lack of "!" after String means "optional" - filter is not required
 */
export const GET_CHARACTERS_PAGINATED = gql`
  query GetCharactersPaginated($page: Int!, $filter: String) {
    characters(page: $page, filter: { name: $filter }) {
      # info: Information about the pages
      info {
        pages      # Total number of pages available
        next       # Next page number (or null if on last page)
        prev       # Previous page number (or null if on first page)
      }
      # results: The actual list of characters
      results {
        id        # Character's unique ID
        name      # Character's name (e.g., "Rick Sanchez")
        image     # URL to character's image
        status    # "Alive", "Dead", or "Unknown"
        species   # "Human", "Alien", etc.
      }
    }
  }
`;

