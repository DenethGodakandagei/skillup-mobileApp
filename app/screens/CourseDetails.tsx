import { COLORS } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "../../styles/viewSingleCourseDetails.style";

export default function CourseDetails () {

  const router = useRouter();
  const { course } = useLocalSearchParams();
  const courseData = typeof course === 'string' ? JSON.parse(course) : course;

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
          onPress: () => console.log("OK pressed"),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios-new" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{courseData.title}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="favorite-border" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Info */}
        <View style={styles.card}>
          <View style={styles.courseInfo}>
            {/* <View style={{ flex: 1 }}>
              <Text style={styles.courseTitle}>Web Development</Text>
              <Text style={styles.courseAuthor}>by John Doe</Text>
            </View> */}
            <Image
              source={{
                uri: courseData.imageUrl,
              }}
              style={styles.thumbnail}
            />
          </View>
          <Text style={styles.courseDescription}>
            {courseData.description}
          </Text>
        </View>

        {/* Course Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you will learn</Text>

          {/* Beginner */}
          <Text style={styles.levelTitle}>Beginner Level</Text>
          <View style={styles.lessonCard}>
            <View style={styles.lessonIcon}>
              <MaterialIcons name="play-arrow" size={22} color="#666" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>Introduction to HTML</Text>
              <Text style={styles.lessonSubtitle}>Your first web page</Text>
            </View>
            <Text style={styles.lessonDuration}>10:32</Text>
          </View>

          {/* Intermediate */}
          <Text style={styles.levelTitle}>Intermediate Level</Text>
          <View style={styles.lessonCard}>
            <View style={styles.lessonIcon}>
              <MaterialIcons name="play-arrow" size={22} color="#666" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>Styling with CSS</Text>
              <Text style={styles.lessonSubtitle}>Making it beautiful</Text>
            </View>
            <Text style={styles.lessonDuration}>15:10</Text>
          </View>

          <View style={styles.lessonCard}>
            <View style={styles.lessonIcon}>
              <MaterialIcons name="play-arrow" size={22} color="#666" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>JavaScript Basics</Text>
              <Text style={styles.lessonSubtitle}>Adding interactivity</Text>
            </View>
            <Text style={styles.lessonDuration}>20:45</Text>
          </View>

          {/* Advanced */}
          <Text style={styles.levelTitle}>Advanced Level</Text>
          <View style={[styles.lessonCard, { opacity: 0.5 }]}>
            <View style={styles.lessonIcon}>
              <MaterialIcons name="lock" size={20} color="#666" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.lessonTitle}>Introduction to React</Text>
              <Text style={styles.lessonSubtitle}>Building powerful UIs</Text>
            </View>
            <Text style={styles.lessonDuration}>25:00</Text>
          </View>
        </View>
      </ScrollView>

      {/* Enroll Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.enrollButton} onPress={showConfirm}>
          <Text style={styles.enrollText} >Enroll Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

