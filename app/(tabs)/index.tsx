import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// 👇 Define a TypeScript interface for your job data
interface Job {
  title: string;
  company: string;
  link: string;
}

// Optional filter list
const filters = ["Full-time", "Part-time", "Remote", "Contract"];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]); // 👈 tell useState it's an array of Job
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://jobserver-7cul.onrender.com/api/jobs');
        const data: Job[] = await response.json();
        
        // Get keywords for this category
        const keywords = categoryKeywords[category.name] || [];
        
        // Filter jobs by matching keywords in title or company
        const filteredByCategory = data.filter((job) => {
          const jobText = `${job.title} ${job.company}`.toLowerCase();
          return keywords.some(keyword => jobText.includes(keyword.toLowerCase()));
        });
        
        // If no matches found with keywords, show all jobs
        setJobs(filteredByCategory.length > 0 ? filteredByCategory : data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category]);

  // Filtered jobs based on search input
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>


      {/* Jobs Section */}
      <Text style={styles.sectionTitle}>Available Top Jobs</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#8177EA" style={{ marginTop: 40 }} />
      ) : filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.link)}
              style={styles.jobCard}
            >
              {/* Company Logo */}
              <View style={styles.companyLogo}>
                <Text style={styles.companyLogoText}>
                  {item.company?.charAt(0).toUpperCase() || '?'}
                </Text>
              </View>

              {/* Job Details */}
              <View style={{ flex: 1 }}>
                <Text style={styles.jobCompany}>{item.company}</Text>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobInfo}>Tap to view details</Text>
              </View>

              {/* Bookmark Icon */}
              <TouchableOpacity style={styles.bookmarkButton}>
                <Text style={styles.bookmarkIcon}>🔖</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noJobsContainer}>
          <Text style={styles.noJobsText}>
            No jobs found in this category at the moment.
          </Text>
          <Text style={styles.noJobsSubtext}>
            Try searching for different keywords or check back later.
          </Text>
        </View>
      )}
    </View>
  );
};

// Main Home Screen Component
const HomeScreen = ({ onCategorySelect }: any) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch jobs and calculate real category counts
  useEffect(() => {
    const fetchJobsAndCalculateCounts = async () => {
      try {
        const response = await fetch('https://jobserver-7cul.onrender.com/api/jobs');
        const data: Job[] = await response.json();
        
        setTotalJobs(data.length);

        // Define categories with icons
        const categoryDefinitions = [
          { id: 1, name: 'Software', icon: '💻', color: '#8177EA' },
          { id: 2, name: 'Hardware', icon: '🔧', color: '#8B4513' },
          { id: 3, name: 'Accounting', icon: '💰', color: '#1E3A8A' },
          { id: 4, name: 'Banking', icon: '🏦', color: '#3B4BA8' },
          { id: 5, name: 'Sales', icon: '📊', color: '#9CA3AF' },
          { id: 6, name: 'HR', icon: '👥', color: '#374151' },
          { id: 7, name: 'Management', icon: '📋', color: '#16A34A' },
          { id: 8, name: 'Admin', icon: '🛡️', color: '#8B5CF6' },
          { id: 9, name: 'Civil Engineering', icon: '🏗️', color: '#1F2937' },
          { id: 10, name: 'Marketing', icon: '📢', color: '#EC4899' },
          { id: 11, name: 'Design', icon: '🎨', color: '#F59E0B' },
          { id: 12, name: 'Healthcare', icon: '⚕️', color: '#EF4444' },
          { id: 13, name: 'Education', icon: '📚', color: '#3B82F6' },
          { id: 14, name: 'Legal', icon: '⚖️', color: '#6B7280' },
          { id: 15, name: 'Hospitality', icon: '🏨', color: '#F97316' },
          { id: 16, name: 'Logistics', icon: '🚚', color: '#14B8A6' },
          { id: 17, name: 'Customer Service', icon: '💬', color: '#8B5CF6' },
          { id: 18, name: 'Data Science', icon: '📊', color: '#06B6D4' },
        ];

        // Calculate real counts for each category
        const categoriesWithCounts = categoryDefinitions.map(cat => {
          const keywords = categoryKeywords[cat.name] || [];
          const count = data.filter((job) => {
            const jobText = `${job.title} ${job.company}`.toLowerCase();
            return keywords.some(keyword => jobText.includes(keyword.toLowerCase()));
          }).length;

          return { ...cat, count };
        });

        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndCalculateCounts();
  }, []);

  const banners = [
    {
      id: 1,
      title: 'skill up',
      subtitle: 'jobs • careers • recruitment',
      mainText: 'Meet us at EDEX Mid Year Expo 2025',
      dateText: '13th & 14th Sept. @ BMICH',
      stallText: 'Stall No R 51',
      bgColor: '#6B5DD3',
      accentColor: '#FFC107',
    },
    {
      id: 2,
      title: 'skill up',
      subtitle: 'jobs • careers • recruitment',
      mainText: 'Join Our Career Workshop',
      dateText: 'Every Saturday @ 10:00 AM',
      stallText: 'Register Now - Free Entry',
      bgColor: '#8177EA',
      accentColor: '#4ADE80',
    },
    {
      id: 3,
      title: 'skill up',
      subtitle: 'jobs • careers • recruitment',
      mainText: 'Premium Job Listings Available',
      dateText: 'Get Hired in 30 Days',
      stallText: 'Upload Your CV Today',
      bgColor: '#9D8FEE',
      accentColor: '#FB923C',
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = BANNER_WIDTH + 16;
    const offset = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.round(offset / slideSize);
    setActiveSlide(activeIndex);
  };

  // Calculate total categories with jobs
  const totalCategories = categories.filter(cat => cat.count > 0).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8177EA" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Career Path</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs or categories..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hot Jobs Section */}
        <View style={styles.hotJobsSection}>
          <Text style={styles.hotJobsText}>
            {loading ? 'Loading...' : `${totalJobs} Hot Jobs`}
          </Text>
        </View>

        {/* Banner Slider */}
        <View style={styles.bannerSliderContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={BANNER_WIDTH + 16}
            contentContainerStyle={styles.bannerScrollContent}
          >
            {banners.map((banner) => (
              <View key={banner.id} style={styles.bannerWrapper}>
                <View style={[styles.banner, { backgroundColor: banner.bgColor }]}>
                  <View style={styles.bannerTop}>
                    <Text style={styles.bannerTopText}>{banner.title}</Text>
                    <Text style={styles.bannerTopSubtext}>{banner.subtitle}</Text>
                  </View>
                  <View style={[styles.bannerBottom, { backgroundColor: banner.accentColor }]}>
                    <Text style={styles.bannerMainText}>{banner.mainText}</Text>
                    <Text style={styles.bannerDateText}>{banner.dateText}</Text>
                    <Text style={styles.bannerStallText}>{banner.stallText}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeSlide === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories Header */}
        <View style={styles.categoriesHeader}>
          <Text style={styles.categoriesTitle}>
            {loading ? 'Loading...' : `(${totalCategories}) Job Categories`}
          </Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setViewMode('grid')}
            >
              <Text style={viewMode === 'grid' ? styles.toggleActive : styles.toggleInactive}>
                {viewMode === 'grid' ? '✓ ' : ''}Grid
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setViewMode('list')}
            >
              <Text style={viewMode === 'list' ? styles.toggleActive : styles.toggleInactive}>
                {viewMode === 'list' ? '✓ ' : ''}List
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {loading ? (
          <ActivityIndicator size="large" color="#8177EA" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Categories - Grid or List View */}
            {viewMode === 'grid' ? (
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <TouchableOpacity 
                    key={category.id} 
                    style={styles.categoryCard}
                    onPress={() => onCategorySelect(category)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <View style={[
                      styles.categoryBadge,
                      category.count === 0 && styles.categoryBadgeInactive
                    ]}>
                      <Text style={styles.categoryCount}>{category.count}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.categoriesList}>
                {categories.map((category) => (
                  <TouchableOpacity 
                    key={category.id} 
                    style={styles.categoryListItem}
                    onPress={() => onCategorySelect(category)}
                  >
                    <View style={styles.categoryListLeft}>
                      <Text style={styles.categoryIconList}>{category.icon}</Text>
                      <Text style={styles.categoryNameList}>{category.name}</Text>
                    </View>
                    <View style={[
                      styles.categoryBadgeList,
                      category.count === 0 && styles.categoryBadgeInactive
                    ]}>
                      <Text style={styles.categoryCountList}>{category.count}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Main App Component with Navigation
const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'details'>('home');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setCurrentScreen('details');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedCategory(null);
  };

  if (currentScreen === 'details' && selectedCategory) {
    return <CategoryDetailsScreen category={selectedCategory} onBack={handleBack} />;
  }

  return <HomeScreen onCategorySelect={handleCategorySelect} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#8177EA',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  notificationButton: {
    position: 'absolute',
    right: 16,
  },
  notificationIcon: {
    fontSize: 24,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    backgroundColor: '#FFFFFF',
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bannerTopSubtext: {
    color: '#FFFFFF',
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
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#8177EA',
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
    color: '#8177EA',
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#8177EA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeInactive: {
    backgroundColor: '#9CA3AF',
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
  categoryBadgeLarge: {
    backgroundColor: '#8177EA',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryCountLarge: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#8177EA',
    fontWeight: 'bold',
    fontSize: 20,
  },
  jobCompany: {
    color: '#8177EA',
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

export default App;