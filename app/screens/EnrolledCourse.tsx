import { COLORS } from "@/constants/theme";
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

interface SubLesson {
  subTitle: string;
  description?: string;
  status: "completed" | "incompleted";
  textNotes?: string;
  videoUrl?: string;
}

interface Lesson {
  lessonTitle: string;
  subLessons: SubLesson[];
}

interface CourseData {
  title: string;
  image: string;
  description: string;
  lessons: Lesson[];
}

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

  // ✅ Check if all sublessons in a lesson are completed
  const isLessonCompleted = (lesson: Lesson) => {
    return lesson.subLessons.every((sub) => sub.status === "completed");
  };

  // ✅ Check if this lesson is unlocked (previous lesson must be completed)
  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true; // First lesson is always unlocked
    const prevLesson = courseData.lessons[index - 1];
    return isLessonCompleted(prevLesson);
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
                  <Text style={styles.levelTitle}>{`${lesson.lessonTitle.substring(0,45)} ${lesson.lessonTitle.length> 45 ? "..." : ""}`}</Text>
                  {!unlocked && (
                    <Ionicons
                      name="lock-closed"
                      size={20}
                      color={COLORS.lightFont}
                    />
                  )}
                </TouchableOpacity>

                {/* Sub-lessons (only when expanded and unlocked) */}
                {expanded === i &&
                  unlocked &&
                  lesson.subLessons.map((sub: SubLesson, j: number) => (
                    <TouchableOpacity
                      key={j}
                      style={{
                        paddingVertical: 8,
                        paddingLeft: 16,
                        flexDirection: "row",
                        alignItems: "center",
                        opacity: sub.status === "completed" ? 0.6 : 1,
                      }}
                      activeOpacity={0.7}
                      onPress={() =>
                        router.push({
                          pathname: "/screens/Lessons",
                          params: {
                            course: JSON.stringify(courseData),
                            subLessonKey: sub.subTitle,
                          },
                        })
                      }
                    >
                      <Ionicons
                        name={
                          sub.status === "completed"
                            ? "checkmark-circle"
                            : "play-circle"
                        }
                        size={20}
                        color={
                          sub.status === "completed"
                            ? COLORS.primary
                            : COLORS.lightFont
                        }
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.subTitle}>{sub.subTitle}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
