import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CertificateData {
  user: {
    fullname: string;
    profileImage: string;
  };
  course: {
    title: string;
    image: string;
  };
  grade: string;
  uniqueCode: string;
}

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [invalidQR, setInvalidQR] = useState(false);
  const router = useRouter();

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text>Checking camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>
          We need your permission to use the camera.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return; // prevent multiple scans
    setScanned(true);
    setVerifying(true);
    setInvalidQR(false);

    try {
      const parsed: CertificateData = JSON.parse(data);

      setTimeout(() => {
        setVerifying(false);
        setCertificateData(parsed);
      }, 1500); // simulate verifying
    } catch {
      setTimeout(() => {
        setVerifying(false);
        setScanned(false);
        setInvalidQR(true);
      }, 500);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setCertificateData(null);
    setInvalidQR(false);
  };

  return (
    <View style={styles.container}>
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={25} color="#1D3D47" />
        </TouchableOpacity>
        
        
      </View>
      <Text style={styles.title}>Scan Certificate</Text>
      <Text style={styles.subtitle}>Point your camera at the QR code</Text>

      {!scanned && !verifying && !certificateData && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.cameraView}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
          <View style={styles.overlay}>
            <View style={[styles.cornerBracket, styles.topLeft]} />
            <View style={[styles.cornerBracket, styles.topRight]} />
            <View style={[styles.cornerBracket, styles.bottomLeft]} />
            <View style={[styles.cornerBracket, styles.bottomRight]} />
            <View style={styles.scanningLine} />
          </View>
        </View>
      )}

      {verifying && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#8177EA" />
          <Text style={styles.verifyingText}>Verifying...</Text>
        </View>
      )}

      {certificateData && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.userInfo}>
              <View>
                <Text style={styles.userName}>{certificateData.user.fullname}</Text>
                <Text style={styles.certificateText}>Certificate of Completion</Text>
              </View>
            </View>
            <View style={styles.verifiedBox}>
              <Ionicons name="ribbon" size={28} color={COLORS.primary} />
              <Text style={styles.verifiedIcon}>Verified</Text>
              
            </View>
           
          </View>
          <View style={styles.cardContent}>
            <View style={styles.row}>
              <Image
                source={{ uri: certificateData.course.image }}
                style={styles.courseImage}
              />
              <View>
                <Text style={styles.accentText}>COURSE TITLE</Text>
                <Text style={styles.courseTitle}>{certificateData.course.title}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.accentText}>GRADE</Text>
            <Text style={styles.courseTitle}>{certificateData.grade}</Text>
            <Text style={styles.accentText}>UNIQUE CODE</Text>
            <Text style={styles.codeText}>{certificateData.uniqueCode}</Text>
          </View>
          <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={resetScanner}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {invalidQR && (
        <View style={styles.centered}>
          <View style={styles.verifiedBox}>
              <Ionicons name="ribbon" size={35} color={COLORS.red} />
              <Text style={{fontSize: 20, color: COLORS.red, fontWeight:800,}}>UNVERIFIED</Text>
            </View>
          <Text style={styles.invalidTitle}>Invalid QR Code</Text>
          <Text style={styles.invalidSubtitle}>
            The QR code you scanned is not a valid Skill Up certificate.
          </Text>
          <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={resetScanner}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F7F7F8" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 25, fontWeight: "800", textAlign: "center", },
  subtitle: { fontSize: 16, textAlign: "center", color: "#555", marginBottom: 20 },
  infoText: { textAlign: "center", fontSize: 16, marginBottom: 20 },
  cameraContainer: { width: "100%", height: 350, borderRadius: 24, overflow: "hidden", justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  cameraView: { width: "100%", height: "100%" },
  overlay: { position: "absolute", width: "75%", height: "75%" },
  cornerBracket: { position: "absolute", width: 40, height: 40, borderWidth: 4, borderColor: "#fff" },
  topLeft: { top: -2, left: -2, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 16 },
  topRight: { top: -2, right: -2, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 16 },
  bottomLeft: { bottom: -2, left: -2, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 16 },
  bottomRight: { bottom: -2, right: -2, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 16 },
  scanningLine: { position: "absolute", top: 0, left: "50%", width: 2, height: "100%", backgroundColor: "#8177EA" , opacity: 0.8},
  verifyingText: { marginTop: 12, fontSize: 18, color: "#333" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  profileImage: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: "#fff" },
  userName: { fontSize: 18, fontWeight: "700" },
  certificateText: { fontSize: 14, color: "#555" },
  verifiedBox:{alignItems: "center"},
  verifiedIcon: { fontSize: 15, color: "#8177EA", fontWeight:800 },
  cardContent: { marginTop: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  courseImage: { width: 48, height: 48, borderRadius: 8 },
  accentText: { fontSize: 12, fontWeight: "700", color: "#8177EA", marginTop: 8 },
  courseTitle: { fontSize: 16, fontWeight: "500", color: "#333" },
  codeText: { fontSize: 14, fontFamily: "monospace", color: "#333" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  invalidIcon: { fontSize: 48, color: "#E53E3E" },
  invalidTitle: { fontSize: 22, fontWeight: "700", color: "#E53E3E", marginTop: 8 },
  invalidSubtitle: { fontSize: 14, color: "#555", marginTop: 4, textAlign: "center" },
  button: { backgroundColor: "#8177EA", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16, textAlign: "center" },
  header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 2,
    },
    iconButton: {
      padding: 8,
      borderRadius: 30,
      backgroundColor: COLORS.surface,
    },
    
});

