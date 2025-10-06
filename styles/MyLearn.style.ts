import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },
  userType: {
    fontSize: 12,
    color: COLORS.lightFont,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 24,
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },
  greetingCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  greetingSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.cardBackground,
  },
  greetingImage: {
    position: "absolute",
    right: -20,
    bottom: -20,
    width: 120,
    height: 120,
    opacity: 0.8,
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    // --- SHADOW STYLES FOR iOS ---
    shadowColor: COLORS.black,
    shadowOffset: {
        width: 0,
        height: 2, // Controls vertical position of the shadow
    },
    shadowOpacity: 0.1, // Controls the transparency of the shadow
    shadowRadius: 3.84, // Controls how blurry the shadow is
    elevation: 6, // A general property for casting shadows on Android
},
  iconWrapper: {
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },
  courseLevel: {
    fontSize: 13,
    color: COLORS.lightFont,
  },
  enrollButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  enrollText: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: "600",
  },
  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
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

