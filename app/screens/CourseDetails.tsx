import { COLORS } from "@/constants/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/viewSingleCourseDetails.style";

interface SubLesson {
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

export default function CourseDetails () {

  const router = useRouter();
  const { course } = useLocalSearchParams();
  const courseData: CourseData = typeof course === 'string' ? JSON.parse(course) : course;
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  const showConfirm = () => {
    Alert.alert(
      'Enroll "Course"?',                 // Title
      "Are you sure you want to enroll ?", // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            
              setEnrolled(true);
             // Navigate to enrolled course start screen
              router.replace({
                pathname: "/screens/EnrolledCourse",
                params: { course: JSON.stringify(courseData) },
              });
          }
        },
      ],
      { cancelable: false }
    );
  };

  const viewCourse = () => {
    // ✅ Already enrolled → go straight to course
              // router.push({
              //   pathname: "/course/start",
              //   params: { course: JSON.stringify(courseData) },
              // });

  }


  


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
          <Text style={styles.sectionTitle}>What you will learn</Text>

          {courseData.lessons.map((lesson: Lesson, i: number) => (
            <View key={i}>
              <Text style={styles.levelTitle}>{lesson.lessonTitle}</Text>

              {lesson.subLessons.map((sub: SubLesson, j: number) => (
                <Text key={j} style={styles.subTitle}>{sub.subTitle}</Text>
              ))}
              
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Enroll Button */}
      <View style={styles.footer}>
        {enrolled ? (
          <TouchableOpacity style={styles.enrollButton} onPress={viewCourse} activeOpacity={0.9}>
            <Text style={styles.enrollText}>View Course</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.enrollButton} onPress={showConfirm} activeOpacity={0.9}>
            <Text style={styles.enrollText}>Enroll Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
