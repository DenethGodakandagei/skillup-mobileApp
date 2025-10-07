import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 👇 Define a TypeScript interface for your job data
interface Job {
  title: string;
  company: string;
  link: string;
}

// Optional filter list
const filters = ["Full-time", "Part-time", "Remote", "Contract"];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]); // 👈 tell useState it's an array of Job
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  // Fetch job data from your API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://jobserver-7cul.onrender.com/api/jobs");
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filtered jobs based on search input
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Search</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#9333ea" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search for jobs or companies"
          placeholderTextColor="#6b7280"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>


      {/* Jobs Section */}
      <Text style={styles.sectionTitle}>Available Top Jobs</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#9333ea" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.link)}
              style={styles.jobCard}
            >
              {/* Company Logo */}
              <View style={[styles.logo, { backgroundColor: "#ede9fe" }]}>
                <Text style={styles.logoText}>
                  {item.company?.charAt(0).toUpperCase() || "?"}
                </Text>
              </View>

              {/* Job Details */}
              <View style={{ flex: 1 }}>
                <Text style={styles.companyName}>{item.company}</Text>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobInfo}>Tap to view details</Text>
              </View>

              {/* Bookmark */}
              <TouchableOpacity>
                <Ionicons name="bookmark-outline" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#ede9fe",
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: "#ede9fe",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: { backgroundColor: "#9333ea" },
  filterText: { color: "#9333ea", fontSize: 14 },
  filterTextActive: { color: "#fff" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  jobCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: { color: "#9333ea", fontWeight: "bold", fontSize: 16 },
  companyName: { color: "#9333ea", fontSize: 12, fontWeight: "500" },
  jobTitle: { fontSize: 16, fontWeight: "bold" },
  jobInfo: { color: "#6b7280", fontSize: 12 },
});
