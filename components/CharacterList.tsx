// components/CharacterList.tsx
import { FlatList, StyleSheet, View, Text, Image } from "react-native";
import { useQuery } from "@apollo/client/react";
import { GET_CHARACTERS } from "../queries/characters";

// Define what a Character looks like
type Character = {
  id: string;
  name: string;
  image: string;
};

// Define what the API response looks like
type CharactersData = {
  characters: {
    results: Character[];
  };
};

export default function CharacterList() {
  // useQuery is a hook that automatically fetches data from the GraphQL API
  // It returns: data (the characters), loading (true while fetching), error (if something went wrong)
  const { data } = useQuery<CharactersData>(GET_CHARACTERS);

  // Extract the characters array from the data
  const characters: Character[] = data?.characters?.results || [];

  return (
    <FlatList
      data={characters}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.id}>#{item.id}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  id: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
});