// config/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Apollo Client is the tool we use to talk to GraphQL APIs
// Think of it as a helper that handles all the network requests for us

// Create the Apollo Client instance
export const client = new ApolloClient({
  // Tell Apollo where to find the GraphQL API
  link: new HttpLink({
    uri: "https://rickandmortyapi.com/graphql", // This is the API endpoint
  }),
  // Cache stores the data we fetch so we don't need to ask for it again
  cache: new InMemoryCache(),
});