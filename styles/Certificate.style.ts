import { COLORS } from "@/constants/theme";
import { StyleSheet } from 'react-native';

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
  finishBtnBox: {
    width: "100%",
    paddingTop:50,
  },
  finishBtn: {
    backgroundColor: COLORS.primary,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
},
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    marginTop: 8,
  },
  
  // --- Certificate Styles ---
  certificateFrame: {
    width: '100%',
    maxWidth: 600, // Max width for tablet views
    minHeight: 500,
    borderWidth: 3,
    borderColor: COLORS.primary, // Primary color border
    borderRadius: 10,
    padding: 30,
    backgroundColor: COLORS.white,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  
  // Body (Text Content)
  certificateBody: {
    alignItems: 'center',
    marginBottom: 40,
  },
  badge: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: 1.5,
    marginBottom: 30,
  },
  presentedTo: {
    fontSize: 14,
    color: COLORS.lightFont,
    marginBottom: 5,
  },
  fullname: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginVertical: 10,
    textAlign: 'center',
  },
  underline: {
    width: '60%',
    height: 1,
    backgroundColor: COLORS.darkGrey,
    marginBottom: 20,
  },
  forText: {
    fontSize: 14,
    color: COLORS.lightFont,
    marginTop: 10,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 15,
  },
  details: {
    fontSize: 16,
    color: COLORS.lightFont,
    textAlign: 'center',
    marginTop: 10,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.black,
  },

  // Footer (QR Code)
  certificateFooter: {
    flexDirection: 'row',
    // Align items to center or space-between depending on desired look
    justifyContent: 'center', 
    alignItems: 'flex-end',
    marginTop: 'auto', // Pushes footer to the bottom
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  qrCodeContainer: { 
    width: 120, // Smaller size for footer
    height: 120,
  },
  verificationInfo: {
    flex: 1, // Takes remaining space
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.lightFont,
  },
  verificationCode: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
    marginBottom: 8,
  },
  
  logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32, // mb-8
    },
    logoPrimaryBlock: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 5,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    logoText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 24, // text-2xl
        paddingRight:2,
    },
    logoPrimaryText: {
        color: COLORS.surface, // Text color inside the primary block (white)
        fontWeight: 'bold',
        fontSize: 20, // text-xl
    },
});