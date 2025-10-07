import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

// Mock job data
const featuredJobs = [
  {
    id: 1,
    company: "Tech Solutions Inc.",
    logo: "TS",
    color: "#5b21b6",
    position: "Software Engineer",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    saved: false,
  },
  {
    id: 2,
    company: "Creative Minds Agency",
    logo: "CM",
    color: "#9333ea",
    position: "Graphic Designer",
    location: "Los Angeles, CA",
    salary: "$60k - $80k",
    saved: false,
  },
  {
    id: 3,
    company: "Global Finance Corp",
    logo: "GF",
    color: "#f3f4f6",
    position: "Financial Analyst",
    location: "New York, NY",
    salary: "$80k - $100k",
    saved: false,
  },
   {
    id: 4,
    company: "NextGen AI Labs",
    logo: "AI",
    color: "#2563eb",
    position: "Machine Learning Engineer",
    location: "Boston, MA",
    salary: "$130k - $160k",
    saved: false,
  },
  {
    id: 5,
    company: "HealthTech Innovations",
    logo: "HI",
    color: "#10b981",
    position: "Mobile App Developer",
    location: "Seattle, WA",
    salary: "$100k - $130k",
    saved: false,
  },
  {
    id: 6,
    company: "CyberSecure Ltd.",
    logo: "CS",
    color: "#dc2626",
    position: "Cybersecurity Specialist",
    location: "Austin, TX",
    salary: "$110k - $140k",
    saved: false,
  },
];

// Filter options
const filters = ["Full-time", "Part-time", "Remote", "Contract"];

// Replace with your Adzuna API credentials
const APP_ID = "5a6a43cc";
const APP_KEY = "a6bb03da140ec04dbc89ad4a7d0c82a5";

export default function App() {
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
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter Chips */}
      <FlatList
        data={filters}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.filterContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.filterChip,
              index === 0 && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                index === 0 && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Featured Jobs */}
      <Text style={styles.sectionTitle}>Featured Jobs</Text>
      <FlatList
        data={featuredJobs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            {/* Company Logo */}
            <View style={[styles.logo, { backgroundColor: item.color }]}>
              <Text
                style={[
                  styles.logoText,
                  item.color === "#f3f4f6" && { color: "#9333ea" },
                ]}
              >
                {item.logo}
              </Text>
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
  logoText: { color: "#9333ea", fontWeight: "bold", fontSize: 16 },
  companyName: { color: "#9333ea", fontSize: 12, fontWeight: "500" },
  jobTitle: { fontSize: 16, fontWeight: "bold" },
  jobInfo: { color: "#6b7280", fontSize: 12 },
});
