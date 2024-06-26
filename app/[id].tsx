import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Ionicons } from "@expo/vector-icons";
type Player = {
  id: number;
  name: string;
  dob: string;
  age: number;
  profile: string;
  role: string;
  battingStyle: string;
  bowlingStyle: string;
  // Batting stats
  batMatches: number;
  batInnings: number;
  runs: number;
  ballsFaced: number;
  outs: number;
  highScore: number | undefined;
  average: any;
  strikeRate: any;
  notOuts: string;
  // Bowling stats
  bowlMatches: number;
  bownInnings: number;
  overs: any;
  wickets: any;
  economy: string;
  bestBowling: string;
  runsConceded: string;
};
import axios from "@/services/axios";
const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);
const StatRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number | string;
}) => (
  <View style={styles.statRow}>
    <View style={styles.statLabelContainer}>
      <Ionicons name={icon} size={20} color="#009270" style={styles.statIcon} />
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);
const ProfileTab = ({ player }: { player: Player }) => (
  <ScrollView style={styles.tabContent}>
    <View style={styles.header}>
      <Image source={{ uri: player?.profile }} style={styles.playerImage} />
      <Text style={styles.playerName}>{player?.name}</Text>
      <Text style={styles.playerCountry}>Nepal</Text>
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <InfoItem label="Born" value={`${player?.dob} (${player.age} years)`} />
      <InfoItem label="Role" value={player.role} />
      <InfoItem label="Batting Style" value={player.battingStyle} />
      <InfoItem label="Bowling Style" value={player.bowlingStyle} />
    </View>
  </ScrollView>
);

const BattingTab = ({ player }: { player: Player }) => (
  <ScrollView style={styles.tabContent}>
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Batting Statistics</Text>
      <View style={styles.statsTable}>
        <StatRow
          icon="calendar-outline"
          label="Matches"
          value={player.batMatches}
        />
        <StatRow
          icon="tennisball-outline"
          label="Innings"
          value={player?.batInnings ?? "N/A"}
        />
        <StatRow
          icon="stats-chart-outline"
          label="Total Runs"
          value={player.runs}
        />
        <StatRow
          icon="trending-up-outline"
          label="Highest Score"
          value={player?.highScore ?? "N/A"}
        />
        <StatRow
          icon="trending-down-outline"
          label="Not Outs"
          value={player?.notOuts ?? 0}
        />
        <StatRow
          icon="calculator-outline"
          label="Average"
          value={
            player.average === "NAN" || parseInt(player.average) === 0
              ? "N/A"
              : parseInt(player.average).toFixed(2)
          }
        />
        <StatRow
          icon="flash-outline"
          label="Strike Rate"
          value={
            parseInt(player.strikeRate) === 0
              ? "N/A"
              : parseInt(player.strikeRate).toFixed(2)
          }
        />
      </View>
    </View>
  </ScrollView>
);

const BowlingTab = ({ player }: { player: Player }) => (
  <ScrollView style={styles.tabContent}>
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Bowling Statistics</Text>
      <View style={styles.statsTable}>
        <StatRow
          icon="calendar-outline"
          label="Matches"
          value={player.bowlMatches}
        />
        <StatRow
          icon="tennisball-outline"
          label="Innings"
          value={player.bownInnings}
        />
        <StatRow icon="flag-outline" label="Wickets" value={player.wickets} />
        <StatRow icon="timer-outline" label="Overs" value={player.overs} />
        <StatRow
          icon="trending-down-outline"
          label="Runs Conceded"
          value={player?.runsConceded ?? 0}
        />
        <StatRow
          icon="trending-down-outline"
          label="Economy"
          value={parseInt(player.economy).toFixed(2)}
        />
        <StatRow
          icon="trophy-outline"
          label="Best Bowling"
          value={player.bestBowling}
        />
      </View>
    </View>
  </ScrollView>
);

export default function PlayerDetailScreen() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const layout = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "profile", title: "Profile" },
    { key: "batting", title: "Batting" },
    { key: "bowling", title: "Bowling" },
  ]);

  // useEffect(() => {
  //   async function fetchPlayerDetail() {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`/players/${id}`);
  //       setPlayer(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Error fetching player data:", error);
  //       // Handle error (e.g., show error message to user)
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchPlayerDetail();
  // }, [id]);
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchPlayerDetail();
  //   }, [fetchPlayerDetail])
  // );
  const fetchPlayerDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/players/${id}`);
      setPlayer(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching player data:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchPlayerDetail();
    }, [fetchPlayerDetail])
  );

  const renderScene = SceneMap({
    profile: () => <ProfileTab player={player} />,
    batting: () => <BattingTab player={player} />,
    bowling: () => <BowlingTab player={player} />,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009270" />
        <Text style={styles.loadingText}>Loading player data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            indicatorStyle={styles.tabIndicator}
          />
        )}
      />
      <TouchableOpacity
        style={styles.addStatsButton}
        onPress={() => {
          console.log("PlayerDetailScreen - Pushing id:", id);
          router.push({ pathname: "addStat", params: { playerId: id } });
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.addStatsButtonText}>Add New Stats</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#009270",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  tabContent: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  playerInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  playerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  playerRole: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: "white",
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009270",
    marginBottom: 10,
  },
  tabBar: {
    backgroundColor: "#009270",
  },
  tabLabel: {
    color: "white",
    fontWeight: "bold",
  },
  tabIndicator: {
    backgroundColor: "white",
  },
  // Keep other styles as they are, they might be used in other parts of your app
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    width: "33%",
    marginBottom: 15,
  },
  addStatsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#009270",

    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  addStatsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  statsContainer: {
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTable: {
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  statLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    marginRight: 10,
  },
  statLabel: {
    fontSize: 16,
    color: "#333",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#009270",
  },
  statTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  playerCountry: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
});
