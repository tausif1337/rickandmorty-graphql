// App.tsx
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./config/apolloClient";
import CharacterList from "./components/CharacterList";

// This is the main App component - it's the entry point of our app
export default function App() {
  return (
    // ApolloProvider wraps our app so all components can use GraphQL queries
    // Think of it as providing the Apollo Client to all child components
    <ApolloProvider client={client}>
      {/* SafeAreaView ensures content isn't hidden behind notches or status bars */}
      <SafeAreaView style={styles.container}>
        {/* This component displays the list of characters */}
        <CharacterList />
      </SafeAreaView>
    </ApolloProvider>
  );
}

// Styles define how our app looks
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the full screen
    backgroundColor: "#ecf0f1", // Light gray background
  },
});