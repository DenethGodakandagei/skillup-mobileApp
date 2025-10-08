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
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32;

// ----------------- Interfaces -----------------
interface Job {
  title: string;
  company: string;
  link: string;
  location?: string;
  description?: string;
  type?: string;
  postedDate?: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
  icon: string;
  color: string;
}

const categoryKeywords: { [key: string]: string[] } = {
  Software: ['developer', 'engineer', 'programmer', 'software', 'frontend', 'backend', 'fullstack', 'react', 'javascript', 'python', 'java', 'web', 'mobile', 'app', 'code', 'tech'],
  Hardware: ['hardware', 'technician', 'repair', 'maintenance', 'equipment', 'electronics'],
  Accounting: ['accountant', 'accounting', 'finance', 'bookkeeper', 'audit', 'tax', 'financial'],
  Banking: ['bank', 'banking', 'financial', 'credit', 'loan', 'teller', 'branch'],
  Sales: ['sales', 'business development', 'account executive', 'representative', 'consultant'],
  HR: ['human resources', 'hr', 'recruiter', 'recruitment', 'talent', 'people', 'hiring'],
  Management: ['manager', 'management', 'director', 'supervisor', 'lead', 'head', 'chief'],
};

// ----------------- Job Details Screen -----------------
const JobDetailsScreen = ({ job, onBack }: { job: Job; onBack: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8177EA" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.jobDetailsTitle}>{job.title}</Text>
        <Text style={styles.jobDetailsCompany}>{job.company}</Text>
        {job.location && <Text style={styles.jobDetailsInfo}>Location: {job.location}</Text>}
        {job.type && <Text style={styles.jobDetailsInfo}>Job Type: {job.type}</Text>}
        {job.postedDate && <Text style={styles.jobDetailsInfo}>Posted: {job.postedDate}</Text>}
        <Text style={styles.jobDetailsDescription}>{job.description || 'No detailed description available.'}</Text>

        <TouchableOpacity style={styles.applyButton} onPress={() => Linking.openURL(job.link)}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ----------------- Category Details Screen -----------------
const CategoryDetailsScreen = ({ category, onBack, onJobSelect }: any) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://jobserver-7cul.onrender.com/api/jobs');
        const data: Job[] = await response.json();

        const keywords = categoryKeywords[category.name] || [];
        const filteredByCategory = data.filter(job => {
          const jobText = `${job.title} ${job.company}`.toLowerCase();
          return keywords.some(keyword => jobText.includes(keyword.toLowerCase()));
        });

        setJobs(filteredByCategory.length > 0 ? filteredByCategory : data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [category]);

  const filteredJobs = jobs.filter(
    job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8177EA" />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={{ width: 60 }} />
      </View>

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

      {loading ? (
        <ActivityIndicator size="large" color="#8177EA" style={{ marginTop: 40 }} />
      ) : filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.jobCard} onPress={() => onJobSelect(item)}>
              <View style={styles.companyLogo}>
                <Text style={styles.companyLogoText}>{item.company?.charAt(0).toUpperCase() || '?'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobCompany}>{item.company}</Text>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobInfo}>Tap for more details</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noJobsContainer}>
          <Text style={styles.noJobsText}>No jobs found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// ----------------- Home Screen with Auto Slider -----------------
const HomeScreen = ({ onCategorySelect }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://jobserver-7cul.onrender.com/api/jobs');
        const data: Job[] = await response.json();

        const categoryDefinitions = [
          { id: 1, name: 'Software', icon: '💻', color: '#8177EA' },
          { id: 2, name: 'Hardware', icon: '🔧', color: '#8B4513' },
          { id: 3, name: 'Accounting', icon: '💰', color: '#1E3A8A' },
          { id: 4, name: 'Banking', icon: '🏦', color: '#3B4BA8' },
          { id: 5, name: 'Sales', icon: '📊', color: '#9CA3AF' },
          { id: 6, name: 'HR', icon: '👥', color: '#374151' },
          { id: 7, name: 'Management', icon: '📋', color: '#16A34A' },
        ];

        const categoriesWithCounts = categoryDefinitions.map(cat => {
          const keywords = categoryKeywords[cat.name] || [];
          const count = data.filter(job => {
            const jobText = `${job.title} ${job.company}`.toLowerCase();
            return keywords.some(keyword => jobText.includes(keyword.toLowerCase()));
          }).length;
          return { ...cat, count };
        });

        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Auto-scroll banners
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (activeSlide + 1) % banners.length;
      setActiveSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * (BANNER_WIDTH + 16),
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8177EA" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Career Path</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8177EA" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Banner Slider */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            snapToInterval={BANNER_WIDTH + 16}
            contentContainerStyle={{ paddingHorizontal: 8, marginBottom: 16 }}
          >
            {banners.map(banner => (
              <View key={banner.id} style={{ width: BANNER_WIDTH, marginHorizontal: 8 }}>
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

          {/* Categories Grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => onCategorySelect(category)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={[styles.categoryBadge, category.count === 0 && styles.categoryBadgeInactive]}>
                  <Text style={styles.categoryCount}>{category.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ----------------- Main App -----------------
const App = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'category' | 'job'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentScreen('category');
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setCurrentScreen('job');
  };

  const handleBack = () => {
    if (currentScreen === 'job') {
      setCurrentScreen('category');
      setSelectedJob(null);
    } else if (currentScreen === 'category') {
      setCurrentScreen('home');
      setSelectedCategory(null);
    }
  };

  if (currentScreen === 'job' && selectedJob) {
    return <JobDetailsScreen job={selectedJob} onBack={handleBack} />;
  }

  if (currentScreen === 'category' && selectedCategory) {
    return <CategoryDetailsScreen category={selectedCategory} onBack={handleBack} onJobSelect={handleJobSelect} />;
  }

  return <HomeScreen onCategorySelect={handleCategorySelect} />;
};

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#8177EA', padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '500' },
  backButton: { position: 'absolute', left: 16 },
  backButtonText: { color: '#FFF', fontSize: 16 },
  searchContainer: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  searchIcon: { fontSize: 20, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1F2937' },
  jobCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  companyLogo: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  companyLogoText: { color: '#8177EA', fontWeight: 'bold', fontSize: 20 },
  jobCompany: { color: '#8177EA', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  jobTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  jobInfo: { fontSize: 12, color: '#6B7280' },
  noJobsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  noJobsText: { fontSize: 18, fontWeight: '600', color: '#6B7280', textAlign: 'center' },
  categoryCard: { width: '30%', backgroundColor: '#FFF', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 12 },
  categoryIcon: { fontSize: 32, marginBottom: 8 },
  categoryName: { fontSize: 14, fontWeight: '500', color: '#1F2937', textAlign: 'center', marginBottom: 8 },
  categoryBadge: { backgroundColor: '#8177EA', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  categoryBadgeInactive: { backgroundColor: '#9CA3AF' },
  categoryCount: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  jobDetailsTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 8 },
  jobDetailsCompany: { fontSize: 16, fontWeight: '600', color: '#8177EA', marginBottom: 8 },
  jobDetailsInfo: { fontSize: 14, marginBottom: 6, color: '#1F2937' },
  jobDetailsDescription: { fontSize: 14, color: '#6B7280', marginVertical: 16 },
  applyButton: { backgroundColor: '#8177EA', padding: 16, borderRadius: 12, alignItems: 'center' },
  applyButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  banner: { borderRadius: 12, overflow: 'hidden', height: 160 },
  bannerTop: { padding: 12 },
  bannerTopText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  bannerTopSubtext: { color: '#FFF', fontSize: 12, marginTop: 4 },
  bannerBottom: { padding: 12, marginTop: 8, borderRadius: 12 },
  bannerMainText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  bannerDateText: { fontSize: 12, color: '#FFF', marginTop: 4 },
  bannerStallText: { fontSize: 12, color: '#FFF', marginTop: 2 },
});

export default App;