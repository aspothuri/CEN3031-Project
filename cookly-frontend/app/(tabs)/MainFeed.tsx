import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

export default function MainFeed() {
  const router = useRouter();

  const sampleData = Array(10).fill({ title: "Recipe Video Placeholder" });

  return (
    <View style={styles.container}>
      {/* searching/filtering at the top */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          placeholderTextColor="#aaa"
        />
      </View>

      {/* attempt at scrolling functionality */}
      <FlatList
        data={sampleData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <Text style={styles.feedText}>{item.title}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 45,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  feedItem: {
    width: "100%",
    height: 600,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  feedText: {
    fontSize: 18,
    color: "#333",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#5be37f",
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  navText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  separator: {
    width: 1, // Border width
    height: "100%", // Height of the border
    backgroundColor: "#fff", // Border color
    marginHorizontal: 10, // Space between buttons and border
  },
});
