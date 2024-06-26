import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "@/services/axios";

export interface PlayerList {
  id: string;
  name: string;
  profile: string;
  role: string;
}

export default function HomeScreen() {
  const [players, setPlayers] = useState<[]>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function fetchplayers() {
      try {
        const response = await axios.get("/players");
        setPlayers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }
    fetchplayers();
  }, []);

  const filteredPlayers = players?.filter((player: PlayerList) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPlayer = ({ item }: { item: PlayerList }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.playerItem}
      onPress={() =>
        router.push({
          pathname: `/${item.id}`,
          // params: { id: item.id },
        })
      }
    >
      <Image source={{ uri: item.profile }} style={styles.playerImage} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerRole}>{item.role}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#009270" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#009270" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appName}>Cric Belbari</Text>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBar}
            placeholder="Search players..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#009270"
            style={styles.loader}
          />
        ) : (
          <FlatList<PlayerList>
            keyExtractor={(item) => item.id}
            data={filteredPlayers}
            renderItem={renderPlayer}
            style={styles.playerList}
            contentContainerStyle={styles.playerListContent}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            router.push({ pathname: "addPlayer" });
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#009270",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#009270",
    padding: 15,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  playerList: {
    flex: 1,
  },
  playerListContent: {
    paddingHorizontal: 10,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  playerRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#009270",
    borderRadius: 28,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#009270", // This will be behind the status bar
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#f0f0f0", // This will start below the status bar
//   },
//   header: {
//     backgroundColor: "#009270",
//     padding: 15,
//   },
//   appName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//     textAlign: "center",
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     margin: 10,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchBar: {
//     flex: 1,
//     paddingVertical: 10,
//     fontSize: 16,
//   },
//   playerList: {
//     flex: 1,
//   },
//   playerListContent: {
//     paddingHorizontal: 10,
//   },
//   playerItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     padding: 15,
//     marginVertical: 5,
//     borderRadius: 5,
//     elevation: 2,
//   },
//   playerImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   playerInfo: {
//     flex: 1,
//   },
//   playerName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   playerRole: {
//     fontSize: 14,
//     color: "#666",
//     marginTop: 2,
//   },
//   fab: {
//     position: "absolute",
//     width: 56,
//     height: 56,
//     alignItems: "center",
//     justifyContent: "center",
//     right: 20,
//     bottom: 20,
//     backgroundColor: "#009270",
//     borderRadius: 28,
//     elevation: 8,
//   },
// });
