import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  headerIcon: {
    padding: 4,
    color: "black",
  },

  profileInfo: {
    paddingBottom: 16,
  },

  /* Cover + Avatar */
  coverContainer: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.surface,
    position: "relative",
  },

coverImage: {
  width: "100%",
  height: "100%",
  resizeMode: "cover",
},
coverEditButton: {
  position: "absolute",
  right: 12,
  bottom: 12,
  backgroundColor: "rgba(0,0,0,0.6)",
  padding: 6,
  borderRadius: 20,
},
  avatarContainer: {
    position: "absolute",
    bottom: -43, // half of avatar size
    left: 16,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.grey,
    overflow: "hidden",
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
   profileImageModalDetailContainer: {
    backgroundColor: COLORS.background,
    maxHeight: height * 0.9,
  },
  profileImageModalDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surface,
  },
  profileImageModalDetailImage: {
    width: width,
    height: width,
  },

  /* Name + Bio */
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 56, // push below avatar
    marginHorizontal: 16,
  },
  bio: {
    fontSize: 14,
    color: COLORS.darkGrey,
    lineHeight: 20,
    marginHorizontal: 16,
    marginTop: 4,
  },

  /* Buttons */
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginHorizontal: 16,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: COLORS.black,
    fontWeight: "600",
    fontSize: 14,
  },
  signoutButtonText: {
    color: COLORS.red,
    fontWeight: "600",
    fontSize: 14,
  },
  shareButton: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
    modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.black,
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.grey,
    borderRadius: 8,
    padding: 12,
    color: COLORS.black,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: COLORS.grey,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "600",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(6, 11, 11, 0.8)",
    justifyContent: "center",
  },
  
});
