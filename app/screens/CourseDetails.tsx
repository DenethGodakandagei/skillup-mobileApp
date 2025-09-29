import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../styles/viewSingleCourseDetails.style";

interface SubLesson {
  subTitle: string;
}

interface Lesson {
  lessonTitle: string;
  subLessons: SubLesson[];
}

interface CourseData {
  _id: Id<"courses">;
  title: string;
  image: string;
  description: string;
  lessons: Lesson[];
}

export default function CourseDetails() {
  const router = useRouter();
  const { course } = useLocalSearchParams();
  const courseData: CourseData =
    typeof course === "string" ? JSON.parse(course) : course;

  const { userId: clerkId } = useAuth();

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  // ✅ Get Convex user by Clerk ID
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    clerkId ? { clerkId } : "skip"
  );

  // ✅ Check enrollment status for this course
  const enrollmentStatus = useQuery(
    api.enrollments.checkEnrollmentStatus,
    convexUser?._id && courseData?._id
      ? { userId: convexUser._id, courseId: courseData._id }
      : "skip"
  );

  // ✅ Mutation to enroll
  const enrollUserToCourse = useMutation(api.enrollments.enrollUserToCourse);

  // ✅ Update enrolled state when query returns
  useEffect(() => {
    if (enrollmentStatus?.enrolled) {
      setEnrolled(true);
    } else {
      setEnrolled(false);
    }
  }, [enrollmentStatus]);

  const handleEnroll = async () => {
    if (!clerkId) {
      Alert.alert("Please sign in to enroll.");
      return;
    }
    if (!convexUser?._id) {
      Alert.alert("User not found in database.");
      return;
    }

    setEnrolling(true);
    try {
      const result = await enrollUserToCourse({
        userId: convexUser._id,
        courseId: courseData._id as any,
      });

      if (result.enrolled) {
        setEnrolled(true);
        router.replace({
          pathname: "/screens/EnrolledCourse",
          params: { course: JSON.stringify(courseData) },
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  const showConfirm = () => {
    Alert.alert(
      `Enroll "${courseData.title}"?`,
      "Are you sure you want to enroll?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: handleEnroll },
      ],
      { cancelable: false }
    );
  };

  const viewCourse = () => {
    router.push({
      pathname: "/screens/EnrolledCourse",
      params: { course: JSON.stringify(courseData) },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#1D3D47" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{courseData.title}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="favorite-border" size={22} color="#1D3D47" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Info */}
        <View style={styles.card}>
          <View style={styles.courseInfo}>
            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}
            <Image
              source={{ uri: courseData.image }}
              style={styles.thumbnail}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
          </View>
          <Text style={styles.courseDescription}>
            {courseData.description}
          </Text>
        </View>

        {/* Lessons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you will learn</Text>
          {courseData.lessons.map((lesson, i) => (
            <View key={i}>
              <Text style={styles.levelTitle}>{lesson.lessonTitle}</Text>
              {lesson.subLessons.map((sub, j) => (
                <Text key={j} style={styles.subTitle}>
                  {sub.subTitle}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {enrolled ? (
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={viewCourse}
            activeOpacity={0.9}
          >
            <Text style={styles.enrollText}>View Course</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={showConfirm}
            activeOpacity={0.9}
            disabled={enrolling}
          >
            <Text style={styles.enrollText}>
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

