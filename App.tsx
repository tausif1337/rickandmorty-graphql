import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ApolloProvider } from "@apollo/client/react";
import * as Updates from "expo-updates";
import { client } from "./config/apolloClient";
import { AppProvider } from "./context/AppContext";
import CharacterList from "./components/CharacterList";

export default function App() {
  useEffect(() => {
    async function checkForUpdates() {
      if (__DEV__) {
        console.log("OTA Updates: Skipped in development mode");
        return;
      }
      
      try {
        // Check if updates are available
        const update = await Updates.checkForUpdateAsync();
        console.log("OTA Updates: Check result", {
          isAvailable: update.isAvailable,
          isEnabled: Updates.isEnabled,
          manifest: Updates.manifest ? "present" : "missing"
        });
        
        if (update.isAvailable) {
          console.log("OTA Updates: Downloading update...");
          await Updates.fetchUpdateAsync();
          console.log("OTA Updates: Update downloaded, reloading...");
          await Updates.reloadAsync();
        } else {
          console.log("OTA Updates: No update available");
        }
      } catch (error) {
        console.log("OTA Updates: Error checking for updates", error);
        // If updates aren't supported, this will throw an error
        // This is expected for local builds that don't support OTA
      }
    }

    checkForUpdates();
  }, []);

  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <AppProvider>
          <SafeAreaView style={styles.container}>
            <CharacterList />
          </SafeAreaView>
        </AppProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e27",
  },
});