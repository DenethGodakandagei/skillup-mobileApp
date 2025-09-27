import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles/MyLearn.style";

export default function MyLearn() {
  const { userId } = useAuth();

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  // Courses query
  const courses = useQuery(api.courses.getCourses) || []; // ✅ fallback to []
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      // you can handle user-specific logic here
    }
  }, [currentUser]);

  // Function to handle card press for navigation
  interface Course {
    _id: string;
    title: string;
    image: string;
    lessons?: unknown[]; // Replace unknown with a Lesson interface if available
    [key: string]: any;
  }

  interface HandleCoursePress {
    (course: Course): void;
  }

  const handleCoursePress: HandleCoursePress = (course) => {
    router.push({
      pathname: "/screens/CourseDetails",
      params: { course: JSON.stringify(course) },
    });
  };

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
              name="notifications"
              size={24}
              color={COLORS.primary}
            />
            <View style={styles.notificationDot} />
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

        {/* My Learn Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Courses</Text>
          </View>

          {/* This outer TouchableOpacity was likely incorrect and has been removed, 
              as we now wrap each individual course card. */}
          {courses.map((course) => {
            return (
              // The entire card (which was a View) is now a TouchableOpacity
              <TouchableOpacity
                key={course._id}
                style={styles.courseCard}
                onPress={() => handleCoursePress(course)} // Navigate on card press
                activeOpacity={0.9}
              >
                <View style={styles.iconWrapper}>
                  {loading && (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    </View>
                  )}
                  <Image
                    source={{
                      uri: course.image,
                    }}
                    style={styles.image}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onError={() => {
                      setLoading(false);
                    }}
                  />
                </View>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseLevel}>
                    {course.lessons?.length || 0} Lessons
                  </Text>
                </View>
                {/* The "View" button (enrollButton) has been removed from here */}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}