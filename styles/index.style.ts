import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32;

export const styles = StyleSheet.create({

    container: {
    flex: 1,
    backgroundColor: COLORS.surface,
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
    marginLeft: 16,
    marginTop:12
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginTop:10
  },
  userType: {
    fontSize: 12,
    color: COLORS.lightFont,
  },
   iconButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: COLORS.surface,
    marginRight: 15,
    marginLeft: 10
  },
  notificationButton: {
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginRight:20,
    marginTop: 10
  },
  greetingCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    position: "relative",
    overflow: "hidden",
    marginLeft: 15,
    marginRight: 15
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 10
  },
  greetingSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.cardBackground,
  },
  headerTitle: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '800',
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
  notificationIcon: {
    fontSize: 24,
  },
  searchContainer: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer2: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
    marginRight:10,
    borderBottomColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  content: {
    flex: 1,
  },
  hotJobsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  hotJobsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  bannerSliderContainer: {
    paddingVertical: 12,
  },
  bannerScrollContent: {
    paddingHorizontal: 8,
  },
  bannerWrapper: {
    width: BANNER_WIDTH,
    marginHorizontal: 8,
  },
  banner: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerTop: {
    padding: 12,
  },
  bannerTopText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerTopSubtext: {
    color: COLORS.white,
    fontSize: 12,
  },
  bannerBottom: {
    padding: 16,
  },
  bannerMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  bannerDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  bannerStallText: {
    fontSize: 14,
    color: '#1F2937',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lighPurple,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 16,
  },
  toggleButton: {
    paddingHorizontal: 8,
  },
  toggleActive: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  toggleInactive: {
    color: '#6B7280',
    fontSize: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 12,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeInactive: {
    backgroundColor: '#9CA3AF',
  },
  categoryCount: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryListItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconList: {
    fontSize: 28,
    marginRight: 12,
  },
  categoryNameList: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  categoryBadgeList: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryCountList: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  detailsHeader: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginTop: 20
  },
  categoryIconLarge: {
    fontSize: 60,
    marginBottom: 12,
  },
  categoryNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  categoryBadgeLarge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryCountLarge: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  jobCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyLogoText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  jobCompany: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobInfo: {
    fontSize: 12,
    color: '#6B7280',
  },
  bookmarkButton: {
    padding: 8,
  },
  bookmarkIcon: {
    fontSize: 20,
  },
  noJobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noJobsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  noJobsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  
});