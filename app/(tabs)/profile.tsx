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
  FlatList,
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
  const { signOut, userId: clerkUserId } = useAuth();
  const router = useRouter();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);

  // ✅ Fetch current user info
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    clerkUserId ? { clerkId: clerkUserId } : "skip"
  );

  // ✅ Fetch all enrolled courses with progress (full course object)
  const enrolledCourses = useQuery(
    api.enrollments.getEnrolledCoursesByUser,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  ) ?? [];

  // ✅ Fetch all certificates for current user
  const certificates = useQuery(
    api.certificates.getAllByUser,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  ) ?? [];

  const [editedProfile, setEditedProfile] = useState({
    fullname: "",
    bio: "",
    coverImage: "",
    profileImage: "",
  });

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

  if (!currentUser) return <Loader />;

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

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setEditedProfile((prev) => ({ ...prev, profileImage: uri }));
      await updateProfile({ ...editedProfile, profileImage: uri });
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
          <Text style={styles.username}>{currentUser.username || "username"}</Text>
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
            <TouchableOpacity onPress={() => setSelectedProfileImage(currentUser.coverImage || null)}>
              {currentUser.coverImage ? (
                <Image source={{ uri: currentUser.coverImage }} style={styles.coverImage} />
              ) : (
                <View style={[styles.coverImage, { backgroundColor: COLORS.primary }]} />
              )}
            </TouchableOpacity>

            {/* Cover Edit Button */}
            <TouchableOpacity style={styles.coverEditButton} onPress={pickCoverImage}>
              <Ionicons name="camera-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>

            {/* AVATAR */}
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickProfileImage}>
                {currentUser.profileImage ? (
                  <Image source={{ uri: currentUser.profileImage }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: COLORS.red }]} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* NAME + BIO */}
          <Text style={styles.name}>{currentUser.fullname}</Text>
          <Text style={styles.bio}>{currentUser.bio || "Add a Bio."}</Text>

          {/* ACTION BUTTONS */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.signoutButton} onPress={() => signOut()}>
              <Text style={styles.signoutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          {/* ENROLLED COURSES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enrolled Courses</Text>

            {!enrolledCourses ? (
              <Loader />
            ) : enrolledCourses.length === 0 ? (
              <Text style={{ color: COLORS.red }}>No courses enrolled yet.</Text>
            ) : (
              <FlatList
                data={enrolledCourses}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.courseCard}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/EnrolledCourse",
                        params: { course: JSON.stringify(item) },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.image }} style={styles.courseImage} />
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseTitle} numberOfLines={2}>
                        {item.title}
                      </Text>

                      {/* Show progress bar only if not completed */}
                      {item.progress >= 100 || item.isCompleted ? (
                        <Text style={{ color: COLORS.primary, fontWeight: "600", marginTop: 4 }}>
                          Completed
                        </Text>
                      ) : (
                        <View style={styles.progressBar}>
                          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* CERTIFICATES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certificates</Text>
            {certificates.length === 0 ? (
              <Text style={{ color: "#6B7280", marginTop: 8 }}>No certificates available yet.</Text>
            ) : (
              <View style={{ marginTop: 12 }}>
                {certificates.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.certificateCard}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/ViewCertificate",
                        params: { certificateId: item._id },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: item.courseSnapshot.image }} style={styles.certificateImage} />
                    <View>
                      <Text style={styles.certTitle} numberOfLines={1}>
                        {item.courseSnapshot.title}
                      </Text>
                      <Text style={styles.certSub}>
                        {item.courseSnapshot.category} • {new Date(item.issuedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Ionicons name="ribbon" size={28} color={COLORS.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* PROFILE IMAGE MODAL */}
      <Modal visible={!!selectedProfileImage} animationType="slide" transparent={true} onRequestClose={() => setSelectedProfileImage(null)}>
        <View style={styles.modalBackdrop}>
          {selectedProfileImage && (
            <View style={styles.profileImageModalDetailContainer}>
              <View style={styles.profileImageModalDetailHeader}>
                <TouchableOpacity onPress={() => setSelectedProfileImage(null)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Image source={{ uri: selectedProfileImage }} style={styles.profileImageModalDetailImage} resizeMode="contain" />
            </View>
          )}
        </View>
      </Modal>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsEditModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.fullname}
                  onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, fullname: text }))}
                  placeholderTextColor={COLORS.darkGrey}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile((prev) => ({ ...prev, bio: text }))}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.darkGrey}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
