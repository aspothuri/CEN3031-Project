import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function MainFeed() {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sampleData = Array(3).fill({
    link: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    description: "Sample placeholder recipe video",
    likes: 0,
    views: 0,
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/video/search/${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();
      console.log("🔍 Fetched data:", data);
      setSearchResults(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSearchResults([]);
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <View style={styles.container}>
      {/* Back Button (only after a search) */}
      {searchResults.length > 0 && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleReset} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#02b33a" />
          </TouchableOpacity>
        </View>
      )}

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#5be37f" style={{ marginTop: 10 }} />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Video Feed */}
      <FlatList
        ref={listRef}
        data={searchResults.length > 0 ? searchResults : sampleData}
        keyExtractor={(item, index) => item.link || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <Video
              source={{ uri: item.link }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              style={styles.video}
              useNativeControls={false}
            />
            <Text style={styles.feedText}>{item.description}</Text>
            <Text style={styles.metaText}>👍 {item.likes}   👁️ {item.views}</Text>
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
  header: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 6,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#02b33a",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  feedItem: {
    width: "100%",
    height: 600,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  video: {
    width: "100%",
    height: 500,
    borderRadius: 10,
  },
  feedText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
});
