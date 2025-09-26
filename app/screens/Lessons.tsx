import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    ImageBackground,
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../../styles/lessons.styles";

// --- UPDATED INTERFACES ---

interface SubLesson {
    subTitle: string;
    description: string;
    videoUrl?: string;
    status: "completed" | "incompleted"; // NEW: Status field
    textNotes: string; // NEW: Notes field
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

// --- UTILITY FUNCTIONS ---

/**
 * Extracts the YouTube video ID and returns the URL for the high-res thumbnail.
 */
const getThumbnailUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;

    const videoIdMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/)|i\.ytimg\.com\/vi\/|yt\.video\/embed\/)([a-zA-Z0-9_-]{11})/
    );

    if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`; 
    }
    return undefined;
};


/**
 * Helper function to find the main lesson index and local sub-lesson index 
 * given a flat index, crucial for gated navigation.
 */
const findLessonIndices = (courseData: CourseData, flatIndex: number) => {
    let subLessonCount = 0;
    for (let mainIndex = 0; mainIndex < courseData.lessons.length; mainIndex++) {
        const lesson = courseData.lessons[mainIndex];
        const numSubLessons = lesson.subLessons.length;

        if (flatIndex < subLessonCount + numSubLessons) {
            return {
                mainLessonIndex: mainIndex,
                localSubLessonIndex: flatIndex - subLessonCount,
                isLastSubLessonInMainLesson: (flatIndex - subLessonCount) === numSubLessons - 1
            };
        }
        subLessonCount += numSubLessons;
    }
    return { mainLessonIndex: -1, localSubLessonIndex: -1, isLastSubLessonInMainLesson: false };
};


// --- MAIN COMPONENT ---

export default function Lessons() {
    const router = useRouter();
    const { course, subLessonKey } = useLocalSearchParams();

    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [allSubLessons, setAllSubLessons] = useState<SubLesson[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    
    // NEW STATE: To manage the notes text input field
    const [currentNotes, setCurrentNotes] = useState<string>(""); 

    useEffect(() => {
        if (!course) return;

        const parsedCourse: CourseData =
            typeof course === "string" ? JSON.parse(course) : course;
        setCourseData(parsedCourse);

        const subLessonsFlat = parsedCourse.lessons.flatMap(
            (lesson) => lesson.subLessons
        );
        setAllSubLessons(subLessonsFlat);

        if (subLessonKey) {
            const initialIndex = subLessonsFlat.findIndex(
                (s) => s.subTitle === subLessonKey
            );
            setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
        } else {
            setCurrentIndex(0);
        }
    }, [course, subLessonKey]);
    
    // EFFECT to synchronize currentNotes state with the currently selected sub-lesson's notes
    const selectedSubLesson = allSubLessons[currentIndex];
    useEffect(() => {
        // Reset/Update notes whenever the current sub-lesson changes
        if (selectedSubLesson) {
            setCurrentNotes(selectedSubLesson.textNotes || "");
        }
    }, [selectedSubLesson]);


    const currentLessonInfo = useMemo(() => {
        if (!courseData || currentIndex === -1) {
            return { mainLessonIndex: -1, localSubLessonIndex: -1, isLastSubLessonInMainLesson: false };
        }
        return findLessonIndices(courseData, currentIndex);
    }, [courseData, currentIndex]);

    if (!courseData || allSubLessons.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ padding: 20 }}>Lesson data not found!</Text>
            </View>
        );
    }

    const totalSubLessons = allSubLessons.length;
    const isFirstSubLesson = currentIndex === 0;
    const isLastSubLessonOverall = currentIndex === totalSubLessons - 1;
    const { mainLessonIndex, isLastSubLessonInMainLesson } = currentLessonInfo;

    // --- HANDLERS ---

    // Handler for Next button (implements GATED PROGRESSION)
    const handleNext = () => {
        if (isLastSubLessonOverall) {
            Alert.alert(
                "Course Complete",
                "You have completed all lessons in this course! 🎉"
            );
            return;
        }

        if (isLastSubLessonInMainLesson) {
            // GATED CHECK: If it's the last sub-lesson of a main lesson (e.g., 1.4)
            if (mainLessonIndex + 1 < courseData.lessons.length) {
                // In a real app, you would check selectedSubLesson.status === "completed" here
                // to enforce actual completion before moving to the next main lesson.
                setCurrentIndex(currentIndex + 1);
            }
        } else {
            // Normal sequential navigation within the current main lesson (e.g., 1.2 -> 1.3)
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Handler for Previous button
    const handlePrevious = () => {
        if (!isFirstSubLesson) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Handler to play the video externally (opens YouTube app)
    const handlePlayVideo = () => {
        if (selectedSubLesson.videoUrl) {
            Linking.openURL(selectedSubLesson.videoUrl).catch(err => 
                Alert.alert("Error", "Could not open video URL.")
            );
        }
    };

    // Calculate progress and determine titles
    const completedSubLessons = currentIndex + 1;
    const progressPercentage = Math.round((completedSubLessons / totalSubLessons) * 100);
    const videoThumbnailUrl = getThumbnailUrl(selectedSubLesson.videoUrl);
    const currentMainLessonTitle = mainLessonIndex !== -1 
        ? courseData.lessons[mainLessonIndex].lessonTitle 
        : "Lesson";

    // --- RENDER ---

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name="chevron-back" size={24} color="#1D3D47" />
                </TouchableOpacity>
               <Text style={styles.courseTitle}>
                    {`${currentMainLessonTitle.substring(0, 39)}${
                        currentMainLessonTitle.length > 39 ? '...' : ''
                    }`}
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Main Lesson Title (for context) */}
                
                
                {/* Sub-lesson Title & Description */}
                <Text style={styles.lessonTitle}>{selectedSubLesson.subTitle}</Text>
                <Text style={styles.subLessonDescription}>{selectedSubLesson.description}</Text>

                {/* Video Section (Thumbnail & External Playback) */}
                {videoThumbnailUrl && (
                    <View style={styles.videoContainer}>
                        <ImageBackground
                            source={{ uri: videoThumbnailUrl }} 
                            style={styles.videoBackground}
                        >
                            <TouchableOpacity 
                                style={styles.playButton} 
                                onPress={handlePlayVideo} // Opens video externally
                                activeOpacity={0.8}
                            >
                                <Text style={styles.playIcon}>▶</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                )}

                {/* Notes (Uses textNotes field from data) */}
                <Text style={styles.notesTitle}>Notes</Text>
                <View style={styles.notesContainer}>
                    <TextInput 
                        placeholder="Add notes" 
                        style={styles.notesInput} 
                        multiline
                        value={currentNotes} // Controlled component value
                        onChangeText={setCurrentNotes} // Updates local state
                    />
                </View>

                {/* Progress (Based on total Sub-lessons) */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Sub-Lesson {completedSubLessons} of {totalSubLessons} ({progressPercentage}%)
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progressPercentage}%` },
                            ]}
                        />
                    </View>
                </View>
            </ScrollView>

            {/* Footer (Previous/Next Sub-Lesson Navigation) */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.navButton, isFirstSubLesson && styles.navButtonDisabled]}
                    onPress={handlePrevious}
                    disabled={isFirstSubLesson}
                    activeOpacity={0.8}
                >
                    <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.navButtonText}>
                        {isLastSubLessonOverall ? "Finish Course" : "Next"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}