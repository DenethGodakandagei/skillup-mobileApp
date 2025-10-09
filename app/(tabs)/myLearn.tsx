import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react"; // ⬅️ IMPORT useMemo
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles/MyLearn.style";

// --- INTERFACES ---
interface Course {
  _id: string;
  title: string;
  image: string;
  category: string; // ⬅️ Ensure category is present for filtering
  lessons?: unknown[];
  [key: string]: any;
}

interface HandleCoursePress {
  (course: Course): void;
}
// --- END INTERFACES ---

export default function MyLearn() {
  const { userId } = useAuth();
  const router = useRouter();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All"); // ⬅️ NEW STATE for filtering

  // --- CONVEX QUERIES ---
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const courses = useQuery(api.courses.getCourses) as Course[] || []; // Cast courses to Course[]

  // --- DERIVED DATA & FILTERING LOGIC ---

  // 1. Get unique categories for filters
  const courseCategories = useMemo(() => {
    // Extract unique categories, ensuring 'All' is the first option
    const categories = new Set<string>();
    courses.forEach(course => {
      if (course.category) {
        categories.add(course.category);
      }
    });
    return ["All", ...Array.from(categories)];
  }, [courses]);

  // 2. Filter courses based on selected category
  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All") {
      return courses;
    }
    return courses.filter(course => course.category === selectedCategory);
  }, [courses, selectedCategory]);

  // --- HANDLERS & EFFECTS ---

  useEffect(() => {
    if (currentUser) {
      // you can handle user-specific logic here
    }
  }, [currentUser]);

  const handleCoursePress: HandleCoursePress = (course) => {
    router.push({
      pathname: "/screens/CourseDetails",
      params: { course: JSON.stringify(course) },
    });
  };

  const renderFilterItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedCategory === item && { backgroundColor: COLORS.primary },
      ]}
      onPress={() => setSelectedCategory(item)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.filterText,
          selectedCategory === item && { color: COLORS.white },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderCourseCard = (course: Course) => (
    <TouchableOpacity
      key={course._id}
      style={styles.courseCard}
      onPress={() => handleCoursePress(course)}
      activeOpacity={0.9}
    >
      <View style={styles.iconWrapper}>
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
        <Image
          source={{ uri: course.image }}
          style={styles.image}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseCategory}>{course.category}</Text>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseLevel}>{course.lessons?.length || 0} Main Lessons</Text>
      </View>
      <TouchableOpacity>
        <MaterialIcons name="favorite-border" size={22} color="#1D3D47" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: currentUser?.profileImage }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>{currentUser?.fullname}</Text>
              <Text style={styles.userType}>Silver member</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons
              name="notifications-none"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Greeting Card */}
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingTitle}>
              Hey, {currentUser?.fullname}
            </Text>
            <Text style={styles.greetingSubtitle}>
              Get Educated and find your way.
            </Text>
          </View>
        </View>

        {/* ⬅️ NEW: COURSE CATEGORY FILTERS (FlatList) */}
        <View style={styles.filterContainer}>
          <FlatList
            data={courseCategories}
            renderItem={renderFilterItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterListContent}
          />
        </View>
        {/* ⬅️ END FILTERS */}


        {/* My Learn Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {/* Display count of available courses */}
            <Text style={styles.sectionTitle}>
              Available Courses ({filteredCourses.length})
            </Text>
          </View>

          {/* ⬅️ Courses are now mapped from filteredCourses */}
          {filteredCourses.length > 0 ? (
            filteredCourses.map(renderCourseCard)
          ) : (
            <Text style={styles.noCoursesText}>
              No courses found in the selected category.
            </Text>
          )}

        </View>
      </ScrollView>
    </View>
  );
}
