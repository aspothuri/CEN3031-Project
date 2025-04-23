import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Comment = {
  author: string;
  text: string;
  parentId: string;
};

export default function MainFeed() {
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [feedVideos, setFeedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchFeed = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/video/feed`);
      if (!response.ok) throw new Error("Failed to load video feed");
      const data = await response.json();
      setFeedVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/video/search/${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setSearchResults([]);
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const toggleComments = async (videoId: string) => {
    if (showComments) return setShowComments(false);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comment/all?parentId=${videoId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
      setShowComments(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const postComment = async (videoId: string) => {
    if (!newComment.trim()) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentId: videoId,
          author: "demoUser",
          text: newComment,
        }),
      });
      if (!response.ok) throw new Error("Failed to post comment");
      setNewComment("");
      toggleComments(videoId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 80 });
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }).current;

  React.useEffect(() => {
    fetchFeed();
  }, []);

  const dataToRender = searchResults.length > 0 ? searchResults : feedVideos;

  return (
    <View style={styles.container}>
      {searchResults.length > 0 && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleReset} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#02b33a" />
          </TouchableOpacity>
        </View>
      )}

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

      <FlatList
        ref={listRef}
        data={dataToRender}
        pagingEnabled
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(item, index) => item.link || index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.feedItem}>
            <Video
              source={{ uri: item.link }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={currentIndex === index}
              isLooping
              style={styles.video}
              useNativeControls={false}
            />
            <Text style={styles.feedText}>{item.description}</Text>
            <Text style={styles.metaText}>👍 {item.likes || 0}   👁️ {item.views || 0}</Text>
            <TouchableOpacity onPress={() => toggleComments(item._id)}>
              <Text style={styles.commentToggle}>💬 Comments</Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={showComments} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 50 }}>
          <TouchableOpacity onPress={() => setShowComments(false)} style={{ padding: 10 }}>
            <Text style={{ fontSize: 18, color: "#02b33a" }}>⬇️ Close Comments</Text>
          </TouchableOpacity>
          <ScrollView style={{ padding: 10 }}>
            {comments.map((c, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: "bold" }}>{c.author}</Text>
                <Text>{c.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={{ flexDirection: "row", padding: 10 }}>
            <TextInput
              style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8 }}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
            />
            <TouchableOpacity
              onPress={() => postComment(comments[0]?.parentId)}
              style={{ marginLeft: 10, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#02b33a", borderRadius: 8 }}
            >
              <Text style={{ color: "#fff" }}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingTop: 50,
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
    paddingTop: 20,
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
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.8,
  },
  feedText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  metaText: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
  commentToggle: {
    color: "#02b33a",
    marginTop: 8,
    fontSize: 16,
  },
});
