// import { COLORS } from "@/constants/theme";
// import { MaterialIcons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React from "react";
// import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { styles } from "../../styles/viewSingleCourseDetails.style";

// export default function CourseDetails() {
//   const router = useRouter();
//   const { course } = useLocalSearchParams();
//   const courseData = typeof course === 'string' ? JSON.parse(course) : course;

//   const handleStartCourse = () => {
//     // Navigate to course progress screen
//     // router.push("/course-progress");
//     Alert.alert("Hello")
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
//             <MaterialIcons name="arrow-back-ios" size={24} color={COLORS.primary} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>{courseData.title}</Text>
          
//         </View>

//         {/* Course Info Card */}
//         <View style={styles.courseCard}>
//           <View style={styles.courseIconWrapper}>
//             <MaterialIcons name="code" size={24} color="#ef4444" />
//           </View>
//           <View style={styles.courseInfo}>
//             <Text style={styles.courseTitle}>{courseData.title}</Text>
//             <Text style={styles.courseAuthor}>by John Doe</Text>
//           </View>
//         </View>

//         {/* Progress Bar */}
//         <View style={styles.progressContainer}>
//           <View style={styles.progressHeader}>
//             <Text style={styles.progressText}>Progress</Text>
//             <Text style={styles.progressText}>6/10</Text>
//           </View>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: "60%" }]} />
//           </View>
//         </View>

//         {/* Course Content */}
//         <Text style={styles.sectionTitle}>Course Content</Text>
//         <View style={styles.levelsContainer}>
//           {courseData.levels.map((level: any, index: number) => (
//             <View
//               key={index}
//               style={[
//                 styles.levelCard,
//                 { opacity: index <= 1 ? 1 : 0.5 } // unlock first 2 levels for example
//               ]}
//             >
//               <View style={styles.levelIconWrapper}>
//                 <MaterialIcons
//                   name={index <= 1 ? "play-arrow" : "lock"}
//                   size={24}
//                   color={index <= 1 ? COLORS.primary : "#999"}
//                 />
//               </View>
//               <View style={styles.levelInfo}>
//                 <Text style={styles.levelTitle}>{level.title}</Text>
//                 <Text style={styles.levelDuration}>10:00</Text>
//               </View>
//               {index <= 1 && <MaterialIcons name="check-circle" size={24} color="green" />}
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Start Course Button */}
//       <View style={styles.startButtonContainer}>
//         <TouchableOpacity onPress={handleStartCourse} style={styles.startButton}>
//           <Text style={styles.startButtonText}>Start Course</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }



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

