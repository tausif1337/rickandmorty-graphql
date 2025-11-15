// queries/characters.ts
import { gql } from "@apollo/client";

// This is a GraphQL query - it's like asking the API a question
// We're asking: "Give me all characters with their id, name, and image"
export const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      results {
        id      # Character's unique ID
        name    # Character's name
        image   # URL to character's image
      }
    }
  }
`;
