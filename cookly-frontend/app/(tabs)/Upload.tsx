import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

/**
 * Upload.tsx
 * Screen allowing users to pick a video and upload via multipart/form-data.
 */
export default function Upload() {
  const router = useRouter();
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch (e) {
      Alert.alert("Error picking video", e instanceof Error ? e.message : "Unknown error");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert("Please choose a video first.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "video/mp4",
    } as any);
    formData.append("username", "demoUser"); // TODO: replace with actual user
    formData.append("description", description);

    try {
      // @ts-ignore
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      let data: { message?: string } = {};
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        }
      } catch {
        // Ignore JSON parse error
      }

      if (!response.ok) throw new Error(data.message || "Upload failed.");
      Alert.alert("Success", "Video uploaded successfully!");
      router.push("/(tabs)/MainFeed");
    } catch (e) {
      Alert.alert("Upload Error", e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Video</Text>

      <TouchableOpacity style={styles.pickButton} onPress={pickVideo}>
        <Text style={styles.pickButtonText}>{file?.name || "Choose a video"}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Add description (optional)"
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.uploadButtonContent}>
            <Feather name="upload" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  pickButton: {
    backgroundColor: "#02b33a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  pickButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  uploadButton: {
    backgroundColor: "#02b33a",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  uploadButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
