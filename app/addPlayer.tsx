import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "@/services/axios";

interface NewPlayer {
  id: string;
  name: string;
  profile: string;
  role: string;
  dob: string;
  battingStyle: string;
  bowlingStyle: string;
}

const AddPlayerScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newPlayer, setNewPlayer] = useState<NewPlayer>({
    id: "",
    name: "",
    profile: "",
    role: "",
    dob: "",
    battingStyle: "",
    bowlingStyle: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const handleAddPlayer = async () => {
    if (
      !newPlayer.name.trim() ||
      !newPlayer.role.trim() ||
      !newPlayer.dob.trim()
    ) {
      Alert.alert(
        "Error",
        "Name, Role, and Date of Birth are required fields."
      );
      return;
    }

    // Perform further validation if needed

    setLoading(true);
    const formData: any = new FormData();
    formData.append("name", newPlayer.name);
    formData.append("role", newPlayer.role);
    formData.append("dob", newPlayer.dob);
    formData.append("battingStyle", newPlayer.battingStyle);
    formData.append("bowlingStyle", newPlayer.bowlingStyle);

    if (image) {
      formData.append("profile", {
        uri: image,
        name: "profile.jpg",
        type: "image/jpeg",
      });
    }

    try {
      await axios.post("/players", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/"); // Replace with your actual route
    } catch (error) {
      Alert.alert("Error", "Failed to add player.");
    } finally {
      setLoading(false); // Set loading state to false after completing the operation
    }
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleConfirmDate = (date: Date) => {
    const formattedDate = formatDate(date);
    setNewPlayer({ ...newPlayer, dob: formattedDate });
    hideDatePicker();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();

    if (month.length === 1) {
      month = `0${month}`;
    }
    if (day.length === 1) {
      day = `0${day}`;
    }

    return `${year}-${month}-${day}`;
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleDateInput = (text: string) => {
    setNewPlayer({ ...newPlayer, dob: text });
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setNewPlayer({ ...newPlayer, profile: result.assets[0].uri });
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={newPlayer.name}
        onChangeText={(text) => setNewPlayer({ ...newPlayer, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Role"
        value={newPlayer.role}
        onChangeText={(text) => setNewPlayer({ ...newPlayer, role: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={newPlayer.dob}
        onChangeText={handleDateInput}
        onFocus={showDatePicker}
      />
      {/* <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      /> */}

      <TextInput
        style={styles.input}
        placeholder="Batting Style"
        value={newPlayer.battingStyle}
        onChangeText={(text) =>
          setNewPlayer({ ...newPlayer, battingStyle: text })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Bowling Style"
        value={newPlayer.bowlingStyle}
        onChangeText={(text) =>
          setNewPlayer({
            ...newPlayer,
            bowlingStyle: text,
          })
        }
      />

      <View style={styles.imageContainer}>
        <View style={styles.imagePreviewContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Ionicons name="camera-outline" size={100} color="#666" />
          )}
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleImagePicker}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Pick an image from camera roll
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleAddPlayer}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          Add Player
        </Text>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#009270" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 75,
    marginBottom: 10,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  imagePlaceholder: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#009270",
    color: "white",
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
});

export default AddPlayerScreen;
