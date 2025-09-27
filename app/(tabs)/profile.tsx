import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles } from "../../styles/profile.style";

export default function Profile() {
  const { signOut, userId } = useAuth();
  const router = useRouter();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // ✅ Fetch current user info
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  // ✅ Fetch enrolled courses
  const enrolledCourses = useQuery(
    api.enrollments.getEnrolledCoursesByUser,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  const [editedProfile, setEditedProfile] = useState({
    fullname: "",
    bio: "",
    coverImage: "",
    profileImage: "",
  });

  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);
  const updateProfile = useMutation(api.users.updateProfile);

  useEffect(() => {
    if (currentUser) {
      setEditedProfile({
        fullname: currentUser.fullname || "",
        bio: currentUser.bio || "",
        coverImage: currentUser.coverImage || "",
        profileImage: currentUser.profileImage || "",
      });
    }
  }, [currentUser]);

  if (currentUser === undefined) return <Loader />;

  // 📌 Pick and upload cover image
  const pickCoverImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setEditedProfile((prev) => ({ ...prev, coverImage: uri }));
      await updateProfile({ ...editedProfile, coverImage: uri });
    }
  };

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>
            {currentUser?.username || "username"}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="share-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          {/* COVER IMAGE */}
          <View style={styles.coverContainer}>
            <TouchableOpacity onPress={() => setSelectedProfileImage(currentUser?.coverImage || null)}>
              {currentUser?.coverImage ? (
                <Image
                  source={{ uri: currentUser.coverImage }}
                  style={styles.coverImage}
                />
              ) : (
                <View style={[styles.coverImage, { backgroundColor: COLORS.primary }]} />
              )}
            </TouchableOpacity>

            {/* Cover Image Edit Button */}
            <TouchableOpacity
              style={styles.coverEditButton}
              onPress={pickCoverImage}
            >
              <Ionicons name="camera-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>

            {/* AVATAR */}
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={() => setSelectedProfileImage(currentUser?.profileImage || null)}>
                {currentUser?.profileImage ? (
                  <Image
                    source={{ uri: currentUser.profileImage }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: COLORS.red }]} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* NAME + BIO */}
          <Text style={styles.name}>
            {currentUser?.fullname}
          </Text>
          <Text style={styles.bio}>{currentUser?.bio || "Add a Bio."}</Text>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.signoutButton}
              onPress={() => signOut()}
            >
              <Text style={styles.signoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ ENROLLED COURSES SECTION */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
              Enrolled Courses
            </Text>

            {enrolledCourses === undefined ? (
              <Loader />
            ) : enrolledCourses?.length === 0 ? (
              <Text style={{ color: COLORS.darkGrey }}>No courses enrolled yet.</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {enrolledCourses.map((course: any) => (
                  <TouchableOpacity
                    key={course._id}
                    style={{
                      width: 180,
                      marginRight: 12,
                      backgroundColor: COLORS.white,
                      borderRadius: 12,
                      shadowColor: COLORS.black,
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                    onPress={() =>
                      router.push({
                      pathname: "/screens/EnrolledCourse",
                      params: { course: JSON.stringify(course) },
                    })
                    }
                  >
                    <Image
                      source={{ uri: course.image }}
                      style={{
                        width: "100%",
                        height: 100,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                    
                    <View style={{ padding: 8 }}>
                      <Text
                        style={{ fontWeight: "600", fontSize: 14 }}
                        numberOfLines={2}
                      >
                        {course.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>

      {/* PROFILE IMAGE PREVIEW MODAL */}
      <Modal
        visible={!!selectedProfileImage}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedProfileImage(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedProfileImage && (
            <View style={styles.profileImageModalDetailContainer}>
              <View style={styles.profileImageModalDetailHeader}>
                <TouchableOpacity onPress={() => setSelectedProfileImage(null)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              <Image
                source={{ uri: selectedProfileImage }}
                style={styles.profileImageModalDetailImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
      </Modal>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.fullname}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, fullname: text }))
                  }
                  placeholderTextColor={COLORS.darkGrey}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, bio: text }))
                  }
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.darkGrey}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
