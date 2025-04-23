import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";

const screenWidth = Dimensions.get("window").width;
const itemSize = screenWidth / 4 - 10;

const VideoGrid = ({ videos }: { videos: Array<{ thumbnail: string }> }) => (
  <FlatList
    data={videos}
    numColumns={4}
    keyExtractor={(_, index) => index.toString()}
    renderItem={({ item }) => (
      <Image source={{ uri: item.thumbnail }} style={styles.videoThumbnail} />
    )}
    contentContainerStyle={styles.videoGrid}
  />
);

export default function Profile() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState("recipes");
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    image: "",
  });
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [uploads, setUploads] = useState([]);
  const [saved, setSaved] = useState([]);
  const [hovered, setHovered] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/profile/${username}`
        );
        const data = await res.json();
        setProfile(data || { username: "", email: "", image: "" });
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    const fetchUploads = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/${username}/videos`
        );
        const data = await res.json();
        setUploads(data || []);
      } catch (err) {
        console.error("Failed to fetch uploads:", err);
      }
    };

    const fetchSaved = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/${username}/likedVideos`
        );
        const data = await res.json();
        setSaved(data || []);
      } catch (err) {
        console.error("Failed to fetch saved videos:", err);
      }
    };

    fetchProfile();
    fetchUploads();
    fetchSaved();
  }, [username]);

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const image = result.assets[0];
        const formData = new FormData();
        formData.append("file", {
          uri: image.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
        formData.append("username", username as string);

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/profile/upload`,
          {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Upload failed: ${errText}`);
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
        const refreshed = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/profile/${username}`
        );
        const newData = await refreshed.json();
        setProfile(newData || { username: "", email: "", image: "" });
        setFollowers(newData.followers || []);
        setFollowing(newData.following || []);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Profile</Text>
        <Image
          style={styles.headerImage}
          source={require("@/assets/images/cookly-logo.png")}
        />
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleImageUpload}
        {...(Platform.OS === "web"
          ? {
              onMouseEnter: () => setHovered(true),
              onMouseLeave: () => setHovered(false),
            }
          : {})}
        style={styles.profilePictureContainer}
      >
        <Image
          style={styles.profilePicture}
          source={
            profile?.image
              ? { uri: profile.image + `?t=${Date.now()}` }
              : require("@/assets/images/cookly-logo.png")
          }
        />
        {hovered && Platform.OS === "web" && (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Add/Replace Profile Image</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <Text style={styles.nameText}>{profile.username}</Text>
        <Text style={styles.email}>{profile.email}</Text>
        <View style={styles.followStats}>
          <View style={styles.followBlock}>
            <Text style={styles.followCount}>{following.length}</Text>
            <Text style={styles.followLabel}>Following</Text>
          </View>
          <View style={styles.followBlock}>
            <Text style={styles.followCount}>{followers.length}</Text>
            <Text style={styles.followLabel}>Followers</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setSelectedTab("recipes")}
          style={[styles.tab, selectedTab === "recipes" && styles.activeTab]}
        >
          <Text style={styles.tabText}>Saved Recipes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("uploads")}
          style={[styles.tab, selectedTab === "uploads" && styles.activeTab]}
        >
          <Text style={styles.tabText}>My Uploads</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === "recipes" ? (
        <VideoGrid videos={saved} />
      ) : (
        <VideoGrid videos={uploads} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 45,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    position: "absolute",
    top: 0,
  },
  headerText: {
    color: "#5be37f",
    fontSize: 30,
    fontWeight: "bold",
  },
  headerImage: {
    width: 60,
    height: 60,
  },
  profilePictureContainer: {
    marginTop: 100,
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#5be37f",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  profileInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  followStats: {
    flexDirection: "row",
    marginTop: 10,
    gap: 40,
  },
  followBlock: {
    alignItems: "center",
  },
  followCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  followLabel: {
    fontSize: 14,
    color: "#666",
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#5be37f",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  videoGrid: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  videoThumbnail: {
    width: itemSize,
    height: itemSize,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
});
