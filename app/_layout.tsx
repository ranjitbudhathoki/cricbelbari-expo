import { Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Player Details",
          headerBackTitle: "Back",
          headerTitleStyle: {
            color: "white",
          },

          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: "#009270" }} />
          ),
        }}
      />

      <Stack.Screen
        name="addPlayer"
        options={{
          title: "Add New Player",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
          headerTitleStyle: {
            color: "white",
          },

          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: "#009270" }} />
          ),
        }}
      />
      <Stack.Screen
        name="addStat"
        options={{
          title: "Add Player Stat",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
          headerTitleStyle: {
            color: "white",
          },

          headerBackground: () => (
            <View style={{ flex: 1, backgroundColor: "#009270" }} />
          ),
        }}
      />
    </Stack>
  );
}
