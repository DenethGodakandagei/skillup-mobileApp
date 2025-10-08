import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../styles/viewSingleCourseDetails.style";

// ✅ CONVEX IMPORTS
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface SubLesson {
  subTitle: string;
  description?: string;
  textNotes?: string;
  videoUrl?: string;
}

interface Lesson {
  lessonTitle: string;
  subLessons: SubLesson[];
}

interface CourseData {
  _id: string;
  title: string;
  image: string;
  description: string;
  lessons: Lesson[];
}

// ✅ Helper to check if a specific sub-lesson is completed
const isSubLessonCompleted = (
  lessonIndex: number,
  subLessonIndex: number,
  completedLessons: { lessonIndex: number; subLessonIndex: number }[]
) => {
  return completedLessons.some(
    (c) => c.lessonIndex === lessonIndex && c.subLessonIndex === subLessonIndex
  );
};

export default function EnrolledCourse() {
  const router = useRouter();
  const { course } = useLocalSearchParams();
  const courseData: CourseData =
    typeof course === "string" ? JSON.parse(course) : course;

  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  // ✅ Get Clerk User ID
  const { userId: clerkUserId } = useAuth();

  // ✅ 1. Get Convex user by Clerk ID
  const convexUser = useQuery(api.users.getUserByClerkId, {
    clerkId: clerkUserId ?? "",
  });

  // ✅ 2. Run enrollment query only when convexUser and course ID are ready
  const enrollment = useQuery(
    api.enrollments.getEnrollmentByUserAndCourse,
    convexUser?._id && courseData?._id
      ? { userId: convexUser._id, courseId: courseData._id }
      : "skip"
  );

  const completedLessons = enrollment?.completedLessons || [];

  // ✅ Check if all sub-lessons in a lesson are completed
  const isLessonCompleted = (lessonIndex: number, lesson: Lesson) => {
    return lesson.subLessons.every((_, subIndex) =>
      isSubLessonCompleted(lessonIndex, subIndex, completedLessons)
    );
  };

  // ✅ Check if a lesson is unlocked (previous must be completed)
  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    const previousLesson = courseData.lessons[index - 1];
    return isLessonCompleted(index - 1, previousLesson);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1D3D47" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{courseData.title}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="favorite-border" size={22} color="#1D3D47" />
        </TouchableOpacity>
      </View>

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

        {/* Course Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lessons</Text>

          {courseData.lessons.map((lesson: Lesson, i: number) => {
            const unlocked = isLessonUnlocked(i);
            const completed = isLessonCompleted(i, lesson);

            return (
              <View key={i}>
                {/* Lesson Title */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: unlocked ? 1 : 0.5,
                  }}
                  activeOpacity={unlocked ? 0.8 : 1}
                  onPress={() => {
                    if (unlocked) toggleExpand(i);
                  }}
                >
                  <Text style={styles.levelTitle}>
                    {`${lesson.lessonTitle.substring(0, 45)}${
                      lesson.lessonTitle.length > 45 ? "..." : ""
                    }`}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {completed && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={COLORS.primary}
                        style={{ marginRight: unlocked ? 8 : 0 }}
                      />
                    )}
                    {!unlocked && (
                      <Ionicons
                        name="lock-closed"
                        size={20}
                        color={COLORS.lightFont}
                      />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Sub-lessons */}
                {expanded === i &&
                  unlocked &&
                  lesson.subLessons.map((sub: SubLesson, j: number) => {
                    const subCompleted = isSubLessonCompleted(
                      i,
                      j,
                      completedLessons
                    );
                    return (
                      <TouchableOpacity
                        key={j}
                        style={{
                          paddingVertical: 8,
                          paddingLeft: 16,
                          flexDirection: "row",
                          alignItems: "center",
                          opacity: subCompleted ? 0.9 : 1,
                        }}
                        activeOpacity={0.7}
                        onPress={() =>
                          router.push({
                            pathname: "/screens/Lessons",
                            params: {
                              course: JSON.stringify(courseData),
                              subLessonKey: sub.subTitle,
                              lessonIndex: i.toString(),
                              subLessonIndex: j.toString(),
                            },
                          })
                        }
                      >
                        <Ionicons
                          name={
                            subCompleted ? "checkmark-circle" : "play-circle"
                          }
                          size={20}
                          color={
                            subCompleted ? COLORS.primary : COLORS.lightFont
                          }
                          style={{ marginRight: 8 }}
                        />
                        <Text style={styles.subTitle}>{sub.subTitle}</Text>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
