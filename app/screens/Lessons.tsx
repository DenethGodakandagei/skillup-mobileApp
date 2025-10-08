// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { useAuth } from "@clerk/clerk-expo";
// import { Ionicons } from "@expo/vector-icons";
// import { useConvex, useMutation } from "convex/react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Alert,
//   ImageBackground,
//   Linking,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// import { styles } from "../../styles/lessons.styles";

// // --- INTERFACES ---
// interface SubLesson {
//   subTitle: string;
//   description: string;
//   videoUrl?: string;
//   status: "completed" | "incompleted";
//   textNotes: string;
// }

// interface Lesson {
//   lessonTitle: string;
//   subLessons: SubLesson[];
// }

// interface CourseData {
//   _id: Id<"courses">;
//   title: string;
//   image: string;
//   description: string;
//   lessons: Lesson[];
// }

// // --- UTILS ---
// const getThumbnailUrl = (url?: string) => {
//   if (!url) return undefined;
//   const match = url.match(
//     /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/)|i\.ytimg\.com\/vi\/|yt\.video\/embed\/)([a-zA-Z0-9_-]{11})/
//   );
//   return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : undefined;
// };

// const findLessonIndices = (courseData: CourseData, flatIndex: number) => {
//   let count = 0;
//   for (let i = 0; i < courseData.lessons.length; i++) {
//     const lesson = courseData.lessons[i];
//     if (flatIndex < count + lesson.subLessons.length) {
//       return {
//         mainLessonIndex: i,
//         localSubLessonIndex: flatIndex - count,
//         isLastSubLessonInMainLesson: flatIndex - count === lesson.subLessons.length - 1,
//       };
//     }
//     count += lesson.subLessons.length;
//   }
//   return { mainLessonIndex: -1, localSubLessonIndex: -1, isLastSubLessonInMainLesson: false };
// };

// // --- MAIN COMPONENT ---
// export default function Lessons() {
//   const router = useRouter();
//   const { course, subLessonKey } = useLocalSearchParams();
//   const { userId: clerkUserId } = useAuth();

//   const [courseData, setCourseData] = useState<CourseData | null>(null);
//   const [allSubLessons, setAllSubLessons] = useState<SubLesson[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentNotes, setCurrentNotes] = useState("");
//   const [enrollment, setEnrollment] = useState<any>(null);

//   const completeSubLessonMutation = useMutation(api.enrollments.completeSubLesson);
//   const convex = useConvex();
//   const [convexUserId, setConvexUserId] = useState<Id<"users"> | null>(null);
//   const [showFullNotes, setShowFullNotes] = useState(false);

//   const isCertificateAlreadyHave = false;

//   // Get Convex ID from Clerk ID
//   useEffect(() => {
//     if (!clerkUserId || !convex) return;

//     const fetchConvexId = async () => {
//       try {
//         const user = await convex.query(api.users.getUserByClerkId, { clerkId: clerkUserId });
//         if (user) setConvexUserId(user._id as Id<"users">);
//       } catch (error) {
//         console.error("Error fetching Convex user ID:", error);
//       }
//     };

//     fetchConvexId();
//   }, [clerkUserId, convex]);

//   // Load course
//   useEffect(() => {
//     if (!course) return;
//     const parsed: CourseData = typeof course === "string" ? JSON.parse(course) : course;
//     setCourseData(parsed);
//     const flat = parsed.lessons.flatMap((l) => l.subLessons);
//     setAllSubLessons(flat);

//     if (subLessonKey) {
//       const idx = flat.findIndex((s) => s.subTitle === subLessonKey);
//       setCurrentIndex(idx >= 0 ? idx : 0);
//     } else setCurrentIndex(0);
//   }, [course, subLessonKey]);

//   // Load enrollment and map progress
//   useEffect(() => {
//     if (!courseData || !convexUserId) return;

//     const fetchEnrollment = async () => {
//       try {
//         let e = await convex.query(api.enrollments.getEnrollmentByUserAndCourse, {
//           userId: convexUserId,
//           courseId: courseData._id,
//         });

//         if (!e) {
//           // Enroll user automatically if not enrolled
//           await convex.mutation(api.enrollments.enrollUserToCourse, {
//             userId: convexUserId,
//             courseId: courseData._id,
//           });
//           e = await convex.query(api.enrollments.getEnrollmentByUserAndCourse, {
//             userId: convexUserId,
//             courseId: courseData._id,
//           });
//         }

//         // Map completed lessons to sub-lessons
//         const flat = courseData.lessons.flatMap((l) => l.subLessons);
//         const updatedFlat = flat.map((s, idx) => {
//           const { mainLessonIndex, localSubLessonIndex } = findLessonIndices(courseData, idx);
//           const completed = e && e.completedLessons
//             ? e.completedLessons.some(
//                 (cl: any) =>
//                   cl.lessonIndex === mainLessonIndex && cl.subLessonIndex === localSubLessonIndex
//               )
//             : false;
//           return { ...s, status: (completed ? "completed" : "incompleted") as "completed" | "incompleted" };
//         });

//         setAllSubLessons(updatedFlat);
//         setEnrollment(e);
//       } catch (err) {
//         console.error("Failed to fetch or create enrollment:", err);
//       }
//     };

//     fetchEnrollment();
//   }, [courseData, convexUserId]);

//   const selectedSubLesson = allSubLessons[currentIndex];

//   useEffect(() => {
//     if (selectedSubLesson) setCurrentNotes(selectedSubLesson.textNotes || "");
//   }, [selectedSubLesson]);

//   const currentLessonInfo = useMemo(() => {
//     if (!courseData || currentIndex === -1)
//       return { mainLessonIndex: -1, localSubLessonIndex: -1, isLastSubLessonInMainLesson: false };
//     return findLessonIndices(courseData, currentIndex);
//   }, [courseData, currentIndex]);

//   if (!courseData || allSubLessons.length === 0 || !enrollment) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ padding: 20, alignItems:"center" }}>Loading lesson data...</Text>
//       </View>
//     );
//   }

//   const { mainLessonIndex, localSubLessonIndex } = currentLessonInfo;
//   const totalSubLessons = allSubLessons.length;
//   const isFirstSubLesson = currentIndex === 0;
//   const isLastSubLessonOverall = currentIndex === totalSubLessons - 1;


//   const progressPercentage = enrollment.progress ?? 0;

//   const handleNext = async () => {
//     if (!courseData || !selectedSubLesson || !convexUserId || !enrollment) return;

//     try {
//       // Complete the sublesson
//       const result = await completeSubLessonMutation({
//         lessonIndex: mainLessonIndex,
//         subLessonIndex: localSubLessonIndex,
//         enrollmentId: enrollment._id,
//       });

//       // Refetch enrollment to update progress
//       const updatedEnrollment = await convex.query(api.enrollments.getEnrollmentByUserAndCourse, {
//         userId: convexUserId,
//         courseId: courseData._id,
//       });

//       if (updatedEnrollment) {
//         setEnrollment(updatedEnrollment);

//         // Update local sub-lesson statuses
//         setAllSubLessons((prev) =>
//           prev.map((s, idx) => {
//             const { mainLessonIndex: mi, localSubLessonIndex: si } = findLessonIndices(courseData, idx);
//             const completed = updatedEnrollment.completedLessons.some(
//               (cl: any) => cl.lessonIndex === mi && cl.subLessonIndex === si
//             );
//             return { ...s, status: completed ? "completed" : "incompleted" };
//           })
//         );

//         // If course completed, show alert
//         if (updatedEnrollment.isCompleted) {
//           Alert.alert(
//             "Course Complete",
//             "You have completed all lessons! 🎉 You can now generate your E-Certificate."
//           );
//         }
//       }
//     } catch (err) {
//       console.error(err);
//     }

//     if (!isLastSubLessonOverall) setCurrentIndex(currentIndex + 1);
//   };

//   // Certificate generation
//   const GenerateCertificate = async () => {
//     Alert.alert(
//       "Course Completed",
//       "You can now generate your \nE-Certificate.",
//       [
//         {
//           text: "Generate Certificate",
//           onPress: () => {
//             router.push({
//               pathname: "screens/Certificate",
//               params: {
//                 userId: convexUserId,       
//                 courseId: courseData._id,
//               },
//             });
//           },
//         },
//         { text: "Cancel", style: "cancel" },
//       ]
//     );
//   };

//   const handlePrevious = () => {
//     if (!isFirstSubLesson) setCurrentIndex(currentIndex - 1);
//   };

//   const handlePlayVideo = () => {
//     if (selectedSubLesson.videoUrl)
//       Linking.openURL(selectedSubLesson.videoUrl).catch(() =>
//         Alert.alert("Error", "Could not open video URL")
//       );
//   };

//   const videoThumbnailUrl = getThumbnailUrl(selectedSubLesson.videoUrl);
//   const currentMainLessonTitle =
//     mainLessonIndex !== -1 ? courseData.lessons[mainLessonIndex].lessonTitle : "Lesson";

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.iconButton}
//           onPress={() => router.back()}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="chevron-back" size={24} color="#1D3D47" />
//         </TouchableOpacity>
//         <Text style={styles.courseTitle}>
//           {`${currentMainLessonTitle.substring(0, 39)}${
//             currentMainLessonTitle.length > 39 ? "..." : ""
//           }`}
//         </Text>
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
//         <Text style={styles.lessonSubtitle}>{selectedSubLesson.subTitle}</Text>
//         <Text style={styles.subLessonDescription}>{selectedSubLesson.description}</Text>

//         {videoThumbnailUrl && (
//           <View style={styles.videoContainer}>
//             <ImageBackground
//               source={{ uri: videoThumbnailUrl }}
//               style={styles.videoBackground}
//             >
//               <TouchableOpacity
//                 style={styles.playButton}
//                 onPress={handlePlayVideo}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.playIcon}>▶</Text>
//               </TouchableOpacity>
//             </ImageBackground>
//           </View>
//         )}

//         <Text style={styles.notesTitle}>Notes</Text>
//         <View style={styles.notesContainer}>
//             <Text
//               style={styles.notes}
//               numberOfLines={showFullNotes ? undefined : 4}
//             >
//               {currentNotes}
//             </Text>
//             <TouchableOpacity onPress={() => setShowFullNotes(!showFullNotes)} activeOpacity={0.8}>
//               <Text style={styles.showMoreText}>
//                 {showFullNotes ? "Show less ▲" : "Show more ▼"}
//               </Text>
//             </TouchableOpacity>
//         </View>

//         <View style={styles.progressContainer}>
//           <View style={styles.progressTextContainer}>
//             <Text style={styles.progressText}>Current Progress</Text>
//             <Text style={styles.progressText}>({Math.round(progressPercentage)}%)</Text>
//           </View>
          
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
//           </View>
//         </View>

//         {/* Show Finish Course button if course is 100% completed and no certificate exists */}
//         {progressPercentage >= 100 && !isCertificateAlreadyHave && (
//           <View style={styles.finishBtnBox}>
//             <TouchableOpacity
//               style={styles.finishBtn}
//               onPress={GenerateCertificate}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.navButtonText}>Finish Course</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Show View Certificate button if course is completed and certificate already exists */}
//         {progressPercentage >= 100 && isCertificateAlreadyHave && (
//           <View style={styles.finishBtnBox}>
//             <TouchableOpacity
//               style={styles.finishBtn}
//               onPress={()=> router.push("")}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.navButtonText}>View Certificate</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.navButton, isFirstSubLesson && styles.navButtonDisabled]}
//           onPress={handlePrevious}
//           disabled={isFirstSubLesson}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.previousText}>Previous</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.navButton} onPress={handleNext} activeOpacity={0.8}>
//           <Text style={styles.navButtonText}>Next</Text>
//         </TouchableOpacity>
  
//       </View>
//     </View>
//   );
// }




import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useConvex, useMutation } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ImageBackground,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "../../styles/lessons.styles";

// --- INTERFACES ---
interface SubLesson {
  subTitle: string;
  description: string;
  videoUrl?: string;
  status: "completed" | "incompleted";
  textNotes: string;
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

// --- UTILS ---
const getThumbnailUrl = (url?: string) => {
  if (!url) return undefined;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/)|i\.ytimg\.com\/vi\/|yt\.video\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : undefined;
};

const findLessonIndices = (courseData: CourseData, flatIndex: number) => {
  let count = 0;
  for (let i = 0; i < courseData.lessons.length; i++) {
    const lesson = courseData.lessons[i];
    if (flatIndex < count + lesson.subLessons.length) {
      return {
        mainLessonIndex: i,
        localSubLessonIndex: flatIndex - count,
        isLastSubLessonInMainLesson: flatIndex - count === lesson.subLessons.length - 1,
      };
    }
    count += lesson.subLessons.length;
  }
  return { mainLessonIndex: -1, localSubLessonIndex: -1, isLastSubLessonInMainLesson: false };
};

// --- MAIN COMPONENT ---
export default function Lessons() {
  const router = useRouter();
  const { course, subLessonKey } = useLocalSearchParams();
  const { userId: clerkUserId } = useAuth();

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [allSubLessons, setAllSubLessons] = useState<SubLesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentNotes, setCurrentNotes] = useState("");
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isCertificateAlreadyHave, setIsCertificateAlreadyHave] = useState<boolean>(false);

  const completeSubLessonMutation = useMutation(api.enrollments.completeSubLesson);
  const convex = useConvex();
  const [convexUserId, setConvexUserId] = useState<Id<"users"> | null>(null);
  const [showFullNotes, setShowFullNotes] = useState(false);

  // Get Convex ID from Clerk ID
  useEffect(() => {
    if (!clerkUserId || !convex) return;

    const fetchConvexId = async () => {
      try {
        const user = await convex.query(api.users.getUserByClerkId, { clerkId: clerkUserId });
        if (user) setConvexUserId(user._id as Id<"users">);
      } catch (error) {
        console.error("Error fetching Convex user ID:", error);
      }
    };

    fetchConvexId();
  }, [clerkUserId, convex]);

  // Load course
  useEffect(() => {
    if (!course) return;
    const parsed: CourseData = typeof course === "string" ? JSON.parse(course) : course;
    setCourseData(parsed);
    const flat = parsed.lessons.flatMap((l) => l.subLessons);
    setAllSubLessons(flat);

    if (subLessonKey) {
      const idx = flat.findIndex((s) => s.subTitle === subLessonKey);
      setCurrentIndex(idx >= 0 ? idx : 0);
    } else setCurrentIndex(0);
  }, [course, subLessonKey]);

  // Load enrollment and map progress
  useEffect(() => {
    if (!courseData || !convexUserId) return;

    const fetchEnrollment = async () => {
      try {
        let e = await convex.query(api.enrollments.getEnrollmentByUserAndCourse, {
          userId: convexUserId,
          courseId: courseData._id,
        });

        if (!e) {
          await convex.mutation(api.enrollments.enrollUserToCourse, {
            userId: convexUserId,
            courseId: courseData._id,
          });
          e = await convex.query(api.enrollments.getEnrollmentByUserAndCourse, {
            userId: convexUserId,
            courseId: courseData._id,
          });
        }

        const flat = courseData.lessons.flatMap((l) => l.subLessons);
        const updatedFlat = flat.map((s, idx) => {
          const { mainLessonIndex, localSubLessonIndex } = findLessonIndices(courseData, idx);
          const completed = e && e.completedLessons
            ? e.completedLessons.some(
                (cl: any) =>
                  cl.lessonIndex === mainLessonIndex && cl.subLessonIndex === localSubLessonIndex
              )
            : false;
          return { ...s, status: (completed ? "completed" : "incompleted") as "completed" | "incompleted" };
        });

        setAllSubLessons(updatedFlat);
        setEnrollment(e);
      } catch (err) {
        console.error("Failed to fetch or create enrollment:", err);
      }
    };

    fetchEnrollment();
  }, [courseData, convexUserId]);

  // ✅ Check if certificate already exists for this user & course
  useEffect(() => {
    if (!convexUserId || !courseData) return;

    const checkCertificate = async () => {
      try {
        const cert = await convex.query(api.certificates.getCertificateByUserAndCourse, {
          userId: convexUserId,
          courseId: courseData._id,
        });
        setIsCertificateAlreadyHave(!!cert);
      } catch (err) {
        console.error("Error checking certificate:", err);
      }
    };

    checkCertificate();
  }, [convexUserId, courseData]);

  const selectedSubLesson = allSubLessons[currentIndex];

  useEffect(() => {
    if (selectedSubLesson) setCurrentNotes(selectedSubLesson.textNotes || "");
  }, [selectedSubLesson]);

  const currentLessonInfo = useMemo(() => {
    if (!courseData || currentIndex === -1)
      return { mainLessonIndex: -1, localSubLessonIndex: -1, isLastSubLessonInMainLesson: false };
    return findLessonIndices(courseData, currentIndex);
  }, [courseData, currentIndex]);

  if (!courseData || allSubLessons.length === 0 || !enrollment) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20, textAlign: "center" }}>Loading lesson data...</Text>
      </View>
    );
  }

  const { mainLessonIndex, localSubLessonIndex } = currentLessonInfo;
  const totalSubLessons = allSubLessons.length;
  const isFirstSubLesson = currentIndex === 0;
  const isLastSubLessonOverall = currentIndex === totalSubLessons - 1;

  const progressPercentage = enrollment.progress ?? 0;

  const handleNext = async () => {
    if (!courseData || !selectedSubLesson || !convexUserId || !enrollment) return;

    try {
      await completeSubLessonMutation({
        lessonIndex: mainLessonIndex,
        subLessonIndex: localSubLessonIndex,
        enrollmentId: enrollment._id,
      });

      const updatedEnrollment = await convex.query(api.enrollments.getEnrollmentByUserAndCourse, {
        userId: convexUserId,
        courseId: courseData._id,
      });

      if (updatedEnrollment) {
        setEnrollment(updatedEnrollment);
        setAllSubLessons((prev) =>
          prev.map((s, idx) => {
            const { mainLessonIndex: mi, localSubLessonIndex: si } = findLessonIndices(courseData, idx);
            const completed = updatedEnrollment.completedLessons.some(
              (cl: any) => cl.lessonIndex === mi && cl.subLessonIndex === si
            );
            return { ...s, status: completed ? "completed" : "incompleted" };
          })
        );

        if (updatedEnrollment.isCompleted) {
          Alert.alert(
            "Course Complete",
            "You have completed all lessons! 🎉 You can now generate your E-Certificate."
          );
        }
      }
    } catch (err) {
      console.error(err);
    }

    if (!isLastSubLessonOverall) setCurrentIndex(currentIndex + 1);
  };

  const GenerateCertificate = async () => {
    Alert.alert(
      "Course Completed",
      "You can now generate your \nE-Certificate.",
      [
        {
          text: "Generate Certificate",
          onPress: () => {
            router.push({
              pathname: "screens/CertificateGenerate",
              params: {
                userId: convexUserId,
                courseId: courseData._id,
              },
            });
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handlePrevious = () => {
    if (!isFirstSubLesson) setCurrentIndex(currentIndex - 1);
  };

  const handlePlayVideo = () => {
    if (selectedSubLesson.videoUrl)
      Linking.openURL(selectedSubLesson.videoUrl).catch(() =>
        Alert.alert("Error", "Could not open video URL")
      );
  };

  const videoThumbnailUrl = getThumbnailUrl(selectedSubLesson.videoUrl);
  const currentMainLessonTitle =
    mainLessonIndex !== -1 ? courseData.lessons[mainLessonIndex].lessonTitle : "Lesson";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color="#1D3D47" />
        </TouchableOpacity>
        <Text style={styles.courseTitle}>
          {`${currentMainLessonTitle.substring(0, 39)}${
            currentMainLessonTitle.length > 39 ? "..." : ""
          }`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.lessonSubtitle}>{selectedSubLesson.subTitle}</Text>
        <Text style={styles.subLessonDescription}>{selectedSubLesson.description}</Text>

        {videoThumbnailUrl && (
          <View style={styles.videoContainer}>
            <ImageBackground source={{ uri: videoThumbnailUrl }} style={styles.videoBackground}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayVideo}
                activeOpacity={0.8}
              >
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        )}

        <Text style={styles.notesTitle}>Notes</Text>
        <View style={styles.notesContainer}>
          <Text style={styles.notes} numberOfLines={showFullNotes ? undefined : 4}>
            {currentNotes}
          </Text>
          <TouchableOpacity onPress={() => setShowFullNotes(!showFullNotes)} activeOpacity={0.8}>
            <Text style={styles.showMoreText}>
              {showFullNotes ? "Show less ▲" : "Show more ▼"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressText}>Current Progress</Text>
            <Text style={styles.progressText}>({Math.round(progressPercentage)}%)</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>

        {/* --- Conditional Buttons --- */}
        {progressPercentage >= 100 && !isCertificateAlreadyHave && (
          <View style={styles.finishBtnBox}>
            <TouchableOpacity
              style={styles.finishBtn}
              onPress={GenerateCertificate}
              activeOpacity={0.8}
            >
              <Text style={styles.navButtonText}>Finish Course</Text>
            </TouchableOpacity>
          </View>
        )}

        {progressPercentage >= 100 && isCertificateAlreadyHave && (
          <View style={styles.finishBtnBox}>
            <TouchableOpacity
            style={styles.finishBtn}
            onPress={() =>
              router.push({
                pathname: "/screens/ViewCertificate",
                params: {
                  userId: convexUserId,      // <-- Add this
                  courseId: courseData._id,  // <-- Already there
                },
              })
            }
            activeOpacity={0.8}
          >
            <Text style={styles.navButtonText}>View Certificate</Text>
          </TouchableOpacity>

          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, isFirstSubLesson && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={isFirstSubLesson}
          activeOpacity={0.8}
        >
          <Text style={styles.previousText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
