import { ApolloClient, InMemoryCache, HttpLink, makeVar } from "@apollo/client";

export const currentPageVar = makeVar<number>(1);

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://rickandmortyapi.com/graphql",
  }),
  cache: new InMemoryCache(),
});
