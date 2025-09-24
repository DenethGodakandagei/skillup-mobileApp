import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Job type definition
type Job = {
  id: string;
  company: string;
  logo: string;
  color: string;
  position: string;
  location: string;
  salary: string;
  saved: boolean;
};

const filters = ["Full-time", "Part-time", "Remote", "Contract"];

// Replace with your Adzuna API credentials
const APP_ID = "5a6a43cc";
const APP_KEY = "a6bb03da140ec04dbc89ad4a7d0c82a5";

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>(filters[0]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20&what=software+developer`
      );
      const data = await response.json();

      if (!data.results) {
        setJobs([]);
        return;
      }

      const formattedJobs: Job[] = data.results.map((job: any, index: number) => ({
        id: job.id ? job.id : `job-${index}`,
        company: job.company?.display_name || "Unknown Company",
        logo: job.company?.display_name
          ? job.company.display_name.substring(0, 2).toUpperCase()
          : "NA",
        color: "#9333ea",
        position: job.title || "No Title",
        location: job.location?.display_name || "Location not provided",
        salary: job.salary_min
          ? `$${job.salary_min} - $${job.salary_max || job.salary_min}`
          : "Salary not disclosed",
        saved: false,
      }));

      setJobs(formattedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

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
        <Ionicons
          name="search-outline"
          size={20}
          color="#9333ea"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search for jobs or companies"
          placeholderTextColor="#6b7280"
          style={styles.searchInput}
        />
      </View>

      {/* Filter Chips */}
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.filterContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === item && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Spacer */}
      <View style={{ height: 20 }} />

      {/* Featured Jobs */}
      <Text style={styles.sectionTitle}>Featured Jobs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#9333ea" style={{ flex: 1 }} />
      ) : jobs.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No jobs found.
        </Text>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.jobCard}>
              {/* Company Logo */}
              <View style={[styles.logo, { backgroundColor: item.color }]}>
                <Text style={styles.logoText}>{item.logo}</Text>
              </View>

              {/* Job Details */}
              <View style={{ flex: 1 }}>
                <Text style={styles.companyName}>{item.company}</Text>
                <Text style={styles.jobTitle}>{item.position}</Text>
                <Text style={styles.jobInfo}>{item.location}</Text>
                <Text style={styles.jobInfo}>{item.salary}</Text>
              </View>

              {/* Bookmark */}
              <TouchableOpacity>
                <Ionicons name="bookmark-outline" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
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
  filterContainer: { paddingHorizontal: 20, marginBottom: 20 },
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
    marginTop: 10, // Added gap above section
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
  logoText: { color: "#fff", fontWeight: "bold" },
  companyName: { color: "#9333ea", fontSize: 12, fontWeight: "500" },
  jobTitle: { fontSize: 16, fontWeight: "bold" },
  jobInfo: { color: "#6b7280", fontSize: 12 },

});
