// import { COLORS } from "@/constants/theme";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { Ionicons } from "@expo/vector-icons";
// import { useQuery } from "convex/react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { SvgXml } from "react-native-svg";
// import { styles } from "../../styles/Certificate.style";

// // Format issued date
// function formatDate(isoString: string) {
//   const date = new Date(isoString);
//   return date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

// export default function ViewCertificate() {
//   const { userId, courseId } = useLocalSearchParams<{
//     userId: string;
//     courseId: string;
//   }>();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch existing certificate by userId & courseId
//   const certificateData = useQuery(
//     api.certificates.getByUserAndCourse,
//     userId && courseId
//       ? {
//           userId: userId as Id<"users">,
//           courseId: courseId as Id<"courses">,
//         }
//       : "skip"
//   );

//   useEffect(() => {
//     if (certificateData !== undefined) {
//       // If query finished (even null result), stop loading
//       setLoading(false);
//       if (certificateData === null) {
//         setError("No certificate found for this course.");
//       }
//     }
//   }, [certificateData]);

//   // --- Loading/Error states ---
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.text}>Loading your certificate...</Text>
//       </View>
//     );
//   }

//   if (error || !certificateData) {
//     return (
//       <View style={styles.center}>
//         <Text style={[styles.text, { color: "red" }]}>{error || "Certificate data not found."}</Text>
//       </View>
//     );
//   }

//   // --- Destructure Data ---
//   const { userSnapshot, courseSnapshot, issuedAt, uniqueCode, qrCodeUrl } = certificateData;

//   // --- Main Render ---
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
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.certificateFrame}>
//           {/* Certificate Body */}
//           <View style={styles.certificateBody}>
//             <View style={styles.logoContainer}>
//               <Text style={styles.logoText}>Skill</Text>
//               <View style={styles.logoPrimaryBlock}>
//                 <Text style={styles.logoPrimaryText}>up</Text>
//               </View>
//               <Text style={styles.logoText}>Learning</Text>
//             </View>

//             <Text style={styles.badge}>CERTIFICATE OF COMPLETION</Text>
//             <Text style={styles.presentedTo}>THIS IS PROUDLY PRESENTED TO</Text>
//             <Text style={styles.fullname}>{userSnapshot.fullname}</Text>
//             <View style={styles.underline} />

//             <Text style={styles.forText}>FOR THE SUCCESSFUL COMPLETION OF</Text>
//             <Text style={styles.courseTitle}>{courseSnapshot.title}</Text>
//             <Text style={styles.details}>Achieved on {formatDate(issuedAt)}</Text>
//           </View>

//           {/* QR Code */}
//           <View style={styles.certificateFooter}>
//             <View style={styles.qrCodeContainer}>
//               <SvgXml xml={qrCodeUrl} width="100%" height="100%" />
//             </View>
//           </View>

//           <View style={styles.verificationInfo}>
//             <Text style={styles.verificationText}>VERIFICATION CODE</Text>
//             <Text style={styles.verificationCode}>{uniqueCode}</Text>
//           </View>
//         </View>

//         <View style={styles.finishBtnBox}>
//           <TouchableOpacity
//             style={styles.finishBtn}
//             onPress={() => router.push("/myLearn")}
//             activeOpacity={0.8}
//           >
//             <Text style={styles.navButtonText}>Back to Courses</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }


import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { styles } from "../../styles/Certificate.style";

// Format issued date
function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ViewCertificate() {
  const { userId, courseId, certificateId } = useLocalSearchParams<{
    userId?: string;
    courseId?: string;
    certificateId?: string;
  }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch certificate by ID if certificateId is provided
  const certificateData = useQuery(
    certificateId
      ? api.certificates.getById // You need to implement this query in your Convex backend
      : userId && courseId
      ? api.certificates.getByUserAndCourse
      : "skip",
    certificateId
      ? { certificateId: certificateId as Id<"certificates"> }
      : userId && courseId
      ? {
          userId: userId as Id<"users">,
          courseId: courseId as Id<"courses">,
        }
      : "skip"
  );

  useEffect(() => {
    if (certificateData !== undefined) {
      setLoading(false);
      if (!certificateData) {
        setError("No certificate found.");
      }
    }
  }, [certificateData]);

  // --- Loading/Error states ---
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>Loading your certificate...</Text>
      </View>
    );
  }

  if (error || !certificateData) {
    return (
      <View style={styles.center}>
        <Text style={[styles.text, { color: "red" }]}>{error}</Text>
      </View>
    );
  }

  // --- Destructure Data ---
  const { userSnapshot, courseSnapshot, issuedAt, uniqueCode, qrCodeUrl } = certificateData;

  // --- Main Render ---
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
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.certificateFrame}>
          {/* Certificate Body */}
          <View style={styles.certificateBody}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Skill</Text>
              <View style={styles.logoPrimaryBlock}>
                <Text style={styles.logoPrimaryText}>up</Text>
              </View>
              <Text style={styles.logoText}>Learning</Text>
            </View>

            <Text style={styles.badge}>CERTIFICATE OF COMPLETION</Text>
            <Text style={styles.presentedTo}>THIS IS PROUDLY PRESENTED TO</Text>
            <Text style={styles.fullname}>{userSnapshot.fullname}</Text>
            <View style={styles.underline} />

            <Text style={styles.forText}>FOR THE SUCCESSFUL COMPLETION OF</Text>
            <Text style={styles.courseTitle}>{courseSnapshot.title}</Text>
            <Text style={styles.details}>Achieved on {formatDate(issuedAt)}</Text>
          </View>

          {/* QR Code */}
          <View style={styles.certificateFooter}>
            <View style={styles.qrCodeContainer}>
              <SvgXml xml={qrCodeUrl} width="100%" height="100%" />
            </View>
          </View>

          <View style={styles.verificationInfo}>
            <Text style={styles.verificationText}>VERIFICATION CODE</Text>
            <Text style={styles.verificationCode}>{uniqueCode}</Text>
          </View>
        </View>

        <View style={styles.finishBtnBox}>
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() => router.push("/myLearn")}
            activeOpacity={0.8}
          >
            <Text style={styles.navButtonText}>Back to Courses</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
