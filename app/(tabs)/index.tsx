import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Bell, Bookmark, Search } from "lucide-react-native";

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
];

// Filter options
const filters = ["Full-time", "Part-time", "Remote", "Contract"];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Search</Text>
        <TouchableOpacity>
          <Bell size={24} stroke="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} stroke="#9333ea" style={{ marginRight: 8 }} />
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
              <Bookmark size={20} stroke="#9ca3af" />
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
  logoText: { color: "#fff", fontWeight: "bold" },
  companyName: { color: "#9333ea", fontSize: 12, fontWeight: "500" },
  jobTitle: { fontSize: 16, fontWeight: "bold" },
  jobInfo: { color: "#6b7280", fontSize: 12 },
});
