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
    View
} from "react-native";
import styles from "../../styles/viewSingleCourseDetails.style";

interface SubLesson {
  key: string;
  subTitle: string;
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

          <Text style={styles.courseDescription}>{courseData.description}</Text>
        </View>

        {/* Course Content */}
    <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lessons</Text>

      {courseData.lessons.map((lesson: Lesson, i: number) => (
        <View key={i}>
          {/* Lesson Title with Expand/Collapse */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => toggleExpand(i)}
            activeOpacity={0.8}
          >
            <Text style={styles.levelTitle}>{lesson.lessonTitle}</Text>
          </TouchableOpacity>

          {/* Sub-lessons (only when expanded) */}
          {expanded === i &&
            lesson.subLessons.map((sub: SubLesson, j: number) => (
                <TouchableOpacity
  key={j}
  activeOpacity={0.7}
  onPress={() =>
    router.push({
    pathname: "/screens/Lessons",
    params: {
      course: JSON.stringify(courseData),
      subLessonKey: sub.subTitle, // use subTitle as key
    },
  })
  }
>
  <Text style={styles.subTitle}>{sub.subTitle}</Text>
</TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
      </ScrollView>

    </View>
  );
}
