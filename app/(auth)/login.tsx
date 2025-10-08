import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/auth.styles'
import { useSSO } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'

export default function Login() {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });

      if (setActive && createdSessionId) {
        await setActive({ session: createdSessionId });
        // Small delay to ensure session state syncs with router
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 800);
      }
    } catch (error) {
      console.log("Auth error: ", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.primary, fontSize: 16 }}>
          Setting up your account...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.brandSection}>
        <Text style={styles.appName}>Skill Up</Text>
        <Text style={styles.tagline}>
          Learn, grow, find and master new skills anytime, anywhere..
        </Text>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/job-search-man.png")}
          style={styles.illustration}
          resizeMode='cover'
        />
      </View>

      {/* LOGIN SECTION */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.white} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms and Privacy Policy
        </Text>
      </View>
    </View>
  );
}
