import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";


// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.surface,
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   headerButton: {
//     padding: 8,
//     borderRadius: 24,
//     backgroundColor: COLORS.surface,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.black,
//     marginLeft: 10,
//   },
//   courseCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     marginBottom: 16,
//   },
//   courseIconWrapper: {
//     padding: 12,
//     backgroundColor: "#fee2e2",
//     borderRadius: 12,
//     marginRight: 12,
//   },
//   courseInfo: {
//     flex: 1,
//   },
//   courseTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: COLORS.black,
//   },
//   courseAuthor: {
//     fontSize: 12,
//     color: "#999",
//   },
//   progressContainer: {
//     marginBottom: 24,
//   },
//   progressHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   progressText: {
//     fontSize: 12,
//     color: "#666",
//   },
//   progressBar: {
//     height: 8,
//     backgroundColor: "#e2e2e2",
//     borderRadius: 4,
//     overflow: "hidden",
//   },
//   progressFill: {
//     height: 8,
//     backgroundColor: COLORS.primary,
//     borderRadius: 4,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: COLORS.black,
//     marginBottom: 8,
//   },
//   levelsContainer: {
//     marginBottom: 16,
//   },
//   levelCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     marginBottom: 12,
//   },
//   levelIconWrapper: {
//     padding: 12,
//     backgroundColor: "#e2e2e2",
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   levelInfo: {
//     flex: 1,
//   },
//   levelTitle: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: COLORS.black,
//   },
//   levelDuration: {
//     fontSize: 12,
//     color: "#999",
//   },
//   startButtonContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   startButton: {
//     width: "100%",
//     paddingVertical: 14,
//     backgroundColor: COLORS.primary,
//     borderRadius: 24,
//     alignItems: "center",
//   },
//   startButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#fff",
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
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
    padding: 16,
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