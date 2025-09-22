import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/MyLearn.style";

export default function MyLearn() {

  const { userId } = useAuth();

   const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const courses = useQuery(api.courses.getCourses);
  const router = useRouter();


  useEffect(() => {
    if (currentUser) {
      
    }
  }, [currentUser]);
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
            <MaterialIcons name="notifications" size={24} color={COLORS.primary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Greeting Card */}
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingTitle}>Hey, {currentUser?.fullname}</Text>
            <Text style={styles.greetingSubtitle}>
              Get Educated and find your way.
            </Text>
          </View>
          {/* <Image
            source={{ uri: currentUser?.profileImage }}
            style={styles.greetingImage}
          /> */}
        </View>

        {/* My Learn Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Learn</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {courses?.map((course) => (
          <View key={course._id} style={styles.courseCard}>
            <View style={[styles.iconWrapper, { backgroundColor: "#dbeafe" }]}>
              <MaterialIcons name="school" size={24} color="#3b82f6" />
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseLevel}>
                {course.levels.length} Levels
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.enrollButton} 
              onPress={() => {
                router.push({
                  pathname: "/screens/course-details",
                  params: { course: JSON.stringify(course) }
                });
              }}
            >
              <Text style={styles.enrollText}>Enroll</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      </ScrollView>

      
    </View>
  );
};