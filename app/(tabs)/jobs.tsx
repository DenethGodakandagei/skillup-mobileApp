import JobRoleCard from "@/components/JobRoleCard";
import { useApp } from "@/context/AppContext";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function JobsTab() {
  const { state } = useApp();
  const roles = state?.jobSuggestions?.suggested_roles || [];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="work" size={22} color="#6366f1" />
        <Text style={styles.title}>Suggested Roles ({roles.length})</Text>
      </View>
      {roles.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No roles yet. Upload a CV first.</Text>
        </View>
      ) : (
        roles.map((role, idx) => (
          <JobRoleCard key={idx} role={role} rank={idx + 1} />
        ))
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  title: { marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#1e293b" },
  empty: { padding: 20, alignItems: "center" },
  emptyText: { color: "#6b7280" },
});


