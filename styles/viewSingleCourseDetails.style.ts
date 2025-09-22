import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerButton: {
    padding: 8,
    borderRadius: 24,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
  },
  courseIconWrapper: {
    padding: 12,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },
  courseAuthor: {
    fontSize: 12,
    color: "#999",
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e2e2e2",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 8,
  },
  levelsContainer: {
    marginBottom: 16,
  },
  levelCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
  },
  levelIconWrapper: {
    padding: 12,
    backgroundColor: "#e2e2e2",
    borderRadius: 24,
    marginRight: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.black,
  },
  levelDuration: {
    fontSize: 12,
    color: "#999",
  },
  startButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
  },
  startButton: {
    width: "100%",
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
