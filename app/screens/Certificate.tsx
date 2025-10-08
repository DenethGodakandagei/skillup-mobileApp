import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from 'react-native-svg';
import { styles } from "../../styles/Certificate.style";

// Utility to generate a dynamic date string (e.g., "October 7th, 2025")
function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default function CertificateScreen() {
  const { userId, courseId } = useLocalSearchParams<{
    userId: string;
    courseId: string;
  }>();

  const generateCertificate = useMutation(api.certificateGeneration.generateCertificate);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Logic to GENERATE the certificate and get its ID
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        if (!userId || !courseId) return;

        const res = await generateCertificate({
          userId: userId as Id<"users">,
          courseId: courseId as Id<"courses">,
        });

        // The mutation returns the ID of the created certificate
        setCertificateId(res.certificateId);
      } catch (err: any) {
        console.error("Certificate Generation Error:", err); 
        setError(err.message || "Failed to generate certificate");
        setLoading(false); // Stop loading on generation error
      }
      
    };

    fetchCertificate();
  }, [userId, courseId]);

  const certificateData = useQuery(
    api.certificateGeneration.getDetails, 
    certificateId ? { certificateId: certificateId as Id<"certificates"> } : "skip"
  );

  // Set loading to false once data is available OR if there's an error from the query
  useEffect(() => {
    // Check if certificateData is explicitly null (error, not found) or defined (success)
    if (certificateData !== undefined) {
      setLoading(false);
    }
  }, [certificateData]);
  
  // --- Loading/Error States ---

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>Generating your certificate...</Text>
      </View>
    );
  }

  if (error || !certificateData) {
    return (
      <View style={styles.center}>
        {/* Display generation error or query error */}
        <Text style={[styles.text, { color: "red" }]}>{error || "Certificate data not found."}</Text>
      </View>
    );
  }

  // --- Destructure Data ---
  const { userSnapshot, courseSnapshot, issuedAt, grade, uniqueCode, qrCodeUrl } = certificateData;

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
        
        {/* CERTIFICATE HEADER/BODY */}
        <View style={styles.certificateBody}>
           {/* Logo */}
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
            
            <Text style={styles.details}>Achieving on {formatDate(issuedAt)}</Text>
        </View>

        <View style={styles.certificateFooter}>
            
            {/* QR Code */}
            <View style={styles.qrCodeContainer}>
                <SvgXml
                    xml={qrCodeUrl} // SVG string from Convex
                    width="100%"
                    height="100%"
                />
            </View>
        </View>
        <View style={styles.verificationInfo}>
                <Text style={styles.verificationText}>VERIFICATION CODE</Text>
                <Text style={styles.verificationCode}>{uniqueCode}</Text>
          
            </View>
      </View>
      <View style= {styles.finishBtnBox}>
                <TouchableOpacity style={styles.finishBtn} onPress={() => router.push("/myLearn")} activeOpacity={0.8}>
                <Text style={styles.navButtonText}>Back to Courses</Text>
              </TouchableOpacity>
              </View>
      
    </ScrollView>
    </View>
  );
}

