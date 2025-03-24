import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const Recipes = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentText}>
      Saved Recipes will be displayed here.
    </Text>
  </View>
);

const Uploads = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentText}>Your uploads will be displayed here.</Text>
  </View>
);

export default function Profile() {
  const router = useRouter();
  const { username } = useLocalSearchParams(); //  get username from URL
  const [selectedTab, setSelectedTab] = useState("recipes");
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    image: "",
  });
  const { isLoggedIn } = useAuth();
  console.log(isLoggedIn);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/profile/${username}`
        );
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [username]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Profile</Text>
        <Image
          style={styles.headerImage}
          source={require("@/assets/images/cookly-logo.png")}
        />
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image
          style={styles.profilePicture}
          source={
            profile.image
              ? { uri: profile.image }
              : require("@/assets/images/cookly-logo.png")
          }
        />
      </View>

      {/* Info */}
      <View style={styles.profileInfo}>
        <Text style={styles.nameText}>{profile.username}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>

      {/* Tabs */}
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

      {selectedTab === "recipes" ? <Recipes /> : <Uploads />}
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
  },
  profilePicture: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
  contentContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  contentText: {
    fontSize: 16,
    color: "#666",
  },
});
