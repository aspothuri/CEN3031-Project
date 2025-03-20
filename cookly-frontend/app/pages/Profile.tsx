import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

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

export default function Profile({
  profileName = "Ephraim Nicolas",
  email = "eppy@yahoo.com",
}) {
  const [selectedTab, setSelectedTab] = useState("recipes");
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Profile</Text>
        <Image
          style={styles.headerImage}
          source={require("../../assets/images/cookly-logo.png")}
        />
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image
          style={styles.profilePicture}
          source={require("../../assets/images/cookly-logo.png")}
        />
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Text style={styles.nameText}>{profileName}</Text>
        <Text style={styles.email}>{email}</Text>
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

      {/* Content */}
      {selectedTab === "recipes" ? <Recipes /> : <Uploads />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
