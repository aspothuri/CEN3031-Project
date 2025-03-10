import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from "expo-router";

export default function Profile({ profileName = 'Ephraim Nicolas', email = 'eppy@yahoo.com' }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Profile</Text>
        <Image style={styles.headerImage} source={require("../../assets/images/cookly-logo.png")} />
      </View>

      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Image style={styles.profilePicture} source={require("../../assets/images/cookly-logo.png")} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <Text style={styles.nameText}>{profileName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
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
    color: '#5be37f',
    fontSize: 30,
    fontWeight: 'bold',
  },
  headerImage: {
    width: 60,
    height: 60,
  },
  /* Profile Picture */
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
  /* Profile Info */
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
});