// src/screens/ResultsScreen.js
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import JobRoleCard from "../components/JobRoleCard";
import { useApp } from "../context/AppContext";

const ResultsScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { jobSuggestions } = state;

  const handleNewAnalysis = () => {
    dispatch({ type: "RESET" });
    router.push("/");
  };

  if (!jobSuggestions || !jobSuggestions.suggested_roles) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>No analysis results available</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleNewAnalysis}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Job Match Results</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Skills Analysis Section */}
      {jobSuggestions.analysis && (
        <View style={styles.analysisCard}>
          <Text style={styles.cardTitle}>CV Analysis Summary</Text>

          <View style={styles.analysisRow}>
            <MaterialIcons name="work" size={20} color="#6366f1" />
            <Text style={styles.analysisLabel}>Experience:</Text>
            <Text style={styles.analysisValue}>
              {jobSuggestions.analysis.experience_years} years
            </Text>
          </View>

          <View style={styles.analysisRow}>
            <MaterialIcons name="school" size={20} color="#6366f1" />
            <Text style={styles.analysisLabel}>Education:</Text>
            <Text style={styles.analysisValue}>
              {jobSuggestions.analysis.education}
            </Text>
          </View>

          <View style={styles.skillsSection}>
            <Text style={styles.skillsTitle}>Key Skills:</Text>
            <View style={styles.skillsContainer}>
              {jobSuggestions.analysis.skills?.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.strengthsSection}>
            <Text style={styles.strengthsTitle}>Key Strengths:</Text>
            {jobSuggestions.analysis.key_strengths?.map((strength, index) => (
              <View key={index} style={styles.strengthItem}>
                <MaterialIcons name="star" size={16} color="#fbbf24" />
                <Text style={styles.strengthText}>{strength}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Job Suggestions Section */}
      <View style={styles.suggestionsHeader}>
        <Text style={styles.suggestionsTitle}>
          Recommended Job Roles ({jobSuggestions.suggested_roles?.length || 0})
        </Text>
      </View>

      {jobSuggestions.suggested_roles?.map((role, index) => (
        <JobRoleCard key={index} role={role} rank={index + 1} />
      ))}

      <TouchableOpacity
        style={styles.newAnalysisButton}
        onPress={handleNewAnalysis}
      >
        <MaterialIcons name="add-circle" size={24} color="white" />
        <Text style={styles.newAnalysisButtonText}>Analyze Another CV</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Results generated using AI analysis. Use as guidance only.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
  },
  analysisCard: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
  },
  analysisRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  analysisLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
    minWidth: 80,
  },
  analysisValue: {
    fontSize: 16,
    color: "#6b7280",
    flex: 1,
  },
  skillsSection: {
    marginTop: 15,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 2,
  },
  skillText: {
    fontSize: 14,
    color: "#3730a3",
    fontWeight: "500",
  },
  strengthsSection: {
    marginTop: 15,
  },
  strengthsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  strengthItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  strengthText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  suggestionsHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  suggestionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  newAnalysisButton: {
    backgroundColor: "#6366f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    padding: 15,
    borderRadius: 12,
  },
  newAnalysisButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#6b7280",
    marginTop: 15,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});

export default ResultsScreen;
