import { Tabs } from "expo-router";
import React from "react";
import { Platform, View, TouchableOpacity } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/contexts/AuthContext";
import LogIn from "../LogIn";

import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function _layout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1 }}>
        <LogIn />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height: 70,
          overflow: "visible",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          ...Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        },
      }}
    >
      {/* Main Feed Tab */}
      <Tabs.Screen
        name="MainFeed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="chef-hat" color={color} />
          ),
        }}
      />

      {/* Upload Tab - Big green floating + */}
      <Tabs.Screen
        name="Upload"
        options={{
          title: "",
          tabBarButton: ({ onPress }) => (
            <TouchableOpacity
              onPress={onPress}
              style={{
                top: -30,
                marginBottom: -30,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                elevation: 10,
              }}
            >
              <Ionicons name="add-circle" size={72} color="#02b33a" />
            </TouchableOpacity>

          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-o" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
