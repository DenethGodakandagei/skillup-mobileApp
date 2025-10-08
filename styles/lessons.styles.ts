import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
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
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
    paddingHorizontal: 16,
  },
  lessonSubtitle: {
    fontSize: 15,
    color: COLORS.black,
    fontWeight:700,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom:4,
  },
  subLessonDescription: {
    fontSize: 14,
    color: COLORS.lightFont,
    paddingHorizontal: 16,
    paddingTop: 4,
    textAlign:"left",
  },
  videoContainer: {
    padding: 16,
  },
  videoBackground: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    
  },
  playButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: COLORS.primary,
    fontSize: 30,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121117",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  notesContainer: {
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    padding:10,
    borderColor:COLORS.primary,
    borderRadius:10,
    borderWidth: 1,
    margin: 13,
    
  },
  notes: {
    textAlign: "left",
    fontSize:14
  },
  showMoreText: {
  marginTop: 10,
  fontSize: 13,
  color: COLORS.primary,
  fontWeight: "600",
  textAlign: "right"
},
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressTextContainer: {
    justifyContent:"space-between",
    flexDirection: "row"
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#121117",
    marginBottom: 4,
  },
  progressBar: {
    height: 10,
    borderRadius: 8,
    backgroundColor:COLORS.lighPurple,
  },
  progressFill: {
    height: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  finishBtnBox: {
    width: "100%",
    padding: 14,
    paddingTop:50,
  },
  finishBtn: {
    backgroundColor: COLORS.primary,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  bottomTabs: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f1f0f4",
    backgroundColor: "#ffffff",
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabIcon: {
    fontSize: 24,
    color: "#686487",
    marginBottom: 2,
  },
  tabText: {
    fontSize: 10,
    color: "#686487",
  },
  activeTab: {},
  activeTabText: {
    color: "#121117",
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: COLORS.white,
},
navButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.primary, // Use your primary color
    marginHorizontal: 5,
    alignItems: 'center',
    width:110,
},
navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
},
previousText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    
},
navButtonDisabled: {
    backgroundColor: "#ccc",
},
});
