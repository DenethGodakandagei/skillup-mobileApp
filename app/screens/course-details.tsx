import { COLORS } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/viewSingleCourseDetails.style";

export default function CourseDetails() {
  const router = useRouter();
  const { course } = useLocalSearchParams();
  const courseData = typeof course === 'string' ? JSON.parse(course) : course;

  const handleStartCourse = () => {
    // Navigate to course progress screen
    // router.push("/course-progress");
    Alert.alert("Plyn hutto ynn")
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
            <MaterialIcons name="arrow-back-ios" size={24} color={COLORS.red} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{courseData.title}</Text>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="more-horiz" size={24} color={COLORS.red} />
          </TouchableOpacity>
        </View>

        {/* Course Info Card */}
        <View style={styles.courseCard}>
          <View style={styles.courseIconWrapper}>
            <MaterialIcons name="code" size={24} color="#ef4444" />
          </View>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{courseData.title}</Text>
            <Text style={styles.courseAuthor}>by John Doe</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressText}>6/10</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "60%" }]} />
          </View>
        </View>

        {/* Course Content */}
        <Text style={styles.sectionTitle}>Course Content</Text>
        <View style={styles.levelsContainer}>
          {courseData.levels.map((level: any, index: number) => (
            <View
              key={index}
              style={[
                styles.levelCard,
                { opacity: index <= 1 ? 1 : 0.5 } // unlock first 2 levels for example
              ]}
            >
              <View style={styles.levelIconWrapper}>
                <MaterialIcons
                  name={index <= 1 ? "play-arrow" : "lock"}
                  size={24}
                  color={index <= 1 ? COLORS.primary : "#999"}
                />
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelTitle}>{level.title}</Text>
                <Text style={styles.levelDuration}>10:00</Text>
              </View>
              {index <= 1 && <MaterialIcons name="check-circle" size={24} color="green" />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Start Course Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity onPress={handleStartCourse} style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Course</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}