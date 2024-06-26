import axios from "@/services/axios";
import { useRoute } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

const PlayerStatsForm = () => {
  const { playerId }: any = useLocalSearchParams();
  const [stats, setStats] = useState({
    runs: "",
    ballsFaced: "",
    wickets: "",
    overs: "",
    runsConceded: "",
    didNotBat: false,
    didNotBowl: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string | boolean) => {
    setStats((prevStats) => ({
      ...prevStats,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Player stats submitted:", stats);
    setLoading(true);
    try {
      await axios.post(`/players/${playerId}`, stats);
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to add Stats.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Runs:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange("runs", value)}
          value={stats.runs}
          placeholder="Enter runs"
        />
        <Text style={styles.label}>Balls Faced:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange("ballsFaced", value)}
          value={stats.ballsFaced}
          keyboardType="numeric"
          placeholder="Enter balls faced"
        />
        <Text style={styles.label}>Wickets:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange("wickets", value)}
          value={stats.wickets}
          keyboardType="numeric"
          placeholder="Enter wickets"
        />
        <Text style={styles.label}>Overs:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange("overs", value)}
          value={stats.overs}
          keyboardType="numeric"
          placeholder="Enter overs"
        />
        <Text style={styles.label}>Runs Conceded:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => handleChange("runsConceded", value)}
          value={stats.runsConceded}
          keyboardType="numeric"
          placeholder="Enter runs conceded"
        />
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleChange("didNotBat", !stats.didNotBat)}
          >
            <View
              style={[
                styles.checkboxInner,
                stats.didNotBat && styles.checkboxSelected,
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.checkboxText}>Did not bat</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleChange("didNotBowl", !stats.didNotBowl)}
          >
            <View
              style={[
                styles.checkboxInner,
                stats.didNotBowl && styles.checkboxSelected,
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.checkboxText}>Did not bowl</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#009270" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 0,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009270",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#009270",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#009270",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  radioSelected: {
    backgroundColor: "#009270",
  },
  radioText: {
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: "#009270",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxInner: {
    height: 12,
    width: 12,
  },
  checkboxSelected: {
    backgroundColor: "#009270",
  },
  checkboxText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#009270",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PlayerStatsForm;
