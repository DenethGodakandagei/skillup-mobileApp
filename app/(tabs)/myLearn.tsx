import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/MyLearn.style";

export default function MyLearn() {

  const { userId } = useAuth();

   const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  useEffect(() => {
    if (currentUser) {
      
    }
  }, [currentUser]);
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: currentUser?.profileImage }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.userName}>{currentUser?.fullname}</Text>
              <Text style={styles.userType}>Silver member</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <MaterialIcons name="notifications" size={24} color={COLORS.primary} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Greeting Card */}
        <View style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingTitle}>Hey, {currentUser?.fullname}</Text>
            <Text style={styles.greetingSubtitle}>
              Get Educated and find your way.
            </Text>
          </View>
          {/* <Image
            source={{ uri: currentUser?.profileImage }}
            style={styles.greetingImage}
          /> */}
        </View>

        {/* My Learn Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Learn</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Course Items */}
          <View style={styles.courseCard}>
            <View style={[styles.iconWrapper, { backgroundColor: "#fee2e2" }]}>
              <MaterialIcons name="code" size={24} color="#ef4444" />
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>Web Development</Text>
              <Text style={styles.courseLevel}>10 Levels</Text>
            </View>
            <TouchableOpacity style={styles.enrollButton}>
              <Text style={styles.enrollText}>Enroll</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.courseCard}>
            <View style={[styles.iconWrapper, { backgroundColor: "#dbeafe" }]}>
              <MaterialIcons name="data-object" size={24} color="#3b82f6" />
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>Python for Beginners</Text>
              <Text style={styles.courseLevel}>10 Levels</Text>
            </View>
            <TouchableOpacity style={styles.enrollButton}>
              <Text style={styles.enrollText}>Enroll</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.courseCard}>
            <View style={[styles.iconWrapper, { backgroundColor: "#dcfce7" }]}>
              <MaterialIcons name="phone-iphone" size={24} color="#22c55e" />
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>
                React Native for Beginners
              </Text>
              <Text style={styles.courseLevel}>10 Levels</Text>
            </View>
            <TouchableOpacity style={styles.enrollButton}>
              <Text style={styles.enrollText}>Enroll</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      
    </View>
  );
};
