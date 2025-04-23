import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { ViewToken } from "react-native";
import { useAuth } from "@/contexts/AuthContext";


const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 70;
const BOTTOM_SAFE_AREA = Platform.OS === 'ios' ? 34 : 0;
const CONTENT_BOTTOM_PADDING = TAB_BAR_HEIGHT + BOTTOM_SAFE_AREA;

type VideoItem = {
  _id: string;
  link: string;
  description: string;
  likes: number;
  views: number;
};

export default function MainFeed() {
  const listRef = useRef<FlatList>(null);
const { username } = useAuth(); // or whatever contains the username

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VideoItem[]>([]);
  const [feedVideos, setFeedVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());

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
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/video/search/${encodeURIComponent(searchQuery)}`
      );
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

  const handleLike = async (videoId: string) => {
    try {
      const isLiked = likedVideos.has(videoId);
      const endpoint = isLiked ? "unlike" : "like";
      
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/user/${username}/${videoId}/${endpoint}`
,
        { method: "PATCH" }
      );

      if (response.ok) {
        setFeedVideos(prev => prev.map(video => 
          video._id === videoId ? { 
            ...video, 
            likes: (video.likes ?? 0) + (isLiked ? -1 : 1)
          } : video
        ));

        setLikedVideos(prev => {
          const newSet = new Set(prev);
          isLiked ? newSet.delete(videoId) : newSet.add(videoId);
          return newSet;
        });
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const incrementView = async (videoId: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/video/${videoId}/view`,
        { method: "PATCH" }
      );

      if (response.ok) {
        setFeedVideos(prev => prev.map(video => 
          video._id === videoId ? { ...video, views: video.views + 1 } : video
        ));
      }
    } catch (err) {
      console.error("View increment error:", err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const dataToRender = searchResults.length > 0 ? searchResults : feedVideos;
  
  const viewConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
    waitForInteraction: true,
    minimumViewTime: 300,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      
      const videoId = dataToRender[index]?._id;
      if (videoId) {
        incrementView(videoId);
      }
    }
  });

  const renderVideoItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <View style={styles.videoContainer}>
      <Video
        source={{ uri: item.link }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        shouldPlay={currentIndex === index}
        isLooping
      />
      
      <View style={styles.overlay}>
        <Text style={styles.descriptionOverlay}>{item.description}</Text>
        
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => handleLike(item._id)}
          >
            <Ionicons 
              name={likedVideos.has(item._id) ? "heart" : "heart-outline"} 
              size={28} 
              color={likedVideos.has(item._id) ? "red" : "white"} 
            />
            <Text style={styles.statText}>{item.likes}</Text>
          </TouchableOpacity>
          
          <View style={styles.statItem}>
            <Ionicons name="eye" size={28} color="white" />
            <Text style={styles.statText}>{item.views}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {searchResults.length > 0 && (
          <TouchableOpacity onPress={handleReset} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#02b33a" />
          </TouchableOpacity>
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
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#5be37f" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          ref={listRef}
          data={dataToRender}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderVideoItem}
          pagingEnabled 
          decelerationRate="fast"
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef.current}
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: SCREEN_HEIGHT,
            offset: SCREEN_HEIGHT * index,
            index,
          })}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    zIndex: 10,
  },
  backButton: {
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: SCREEN_HEIGHT*0.23, // Adjusted higher position
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    margin: 12,
  },
  descriptionOverlay: {
    color: "white",
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
  },
  statText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});