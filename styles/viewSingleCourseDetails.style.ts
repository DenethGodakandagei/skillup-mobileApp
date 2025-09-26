import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 16,
    alignItems: "center"
  },
  courseInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  courseAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 12,
   
  },
  courseDescription: {
    fontSize: 14,
    color: COLORS.lightFont,
    marginTop: 8,
    textAlign: "center",
    
  },
  subTitle: {
    fontSize: 14,
    color: COLORS.lightFont,
    marginTop: 8,
    marginLeft: 15,
    textAlign: "left",
    
  },
  section: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.primary,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
    color: "#444",
  },
  lessonCard: {
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  lessonIcon: {
    padding: 10,
    backgroundColor: COLORS.lighPurple,
    borderRadius: 30,
    marginRight: 12,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#121212",
  },
  lessonSubtitle: {
    fontSize: 13,
    color: COLORS.lightFont,
  },
  lessonDuration: {
    fontSize: 13,
    color: COLORS.lightFont,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  enrollButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  enrollText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)", // optional dim background
  },
});

export default styles;