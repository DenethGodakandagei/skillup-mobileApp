// import { COLORS } from "@/constants/theme";
// import { useAuth } from "@clerk/clerk-expo";
// import { Stack, useRouter, useSegments } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, Image, Text, View } from "react-native";

// export default function InitialLayout() {
//   const { isLoaded, isSignedIn } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     if (!isLoaded) return;

//     const inAuthScreen = segments[0] === "(auth)";

//     if (!isSignedIn && !inAuthScreen) {
//       router.replace("/(auth)/login");
//     } else if (isSignedIn && inAuthScreen) {
//       router.replace("/(tabs)");
//     }

//     // Give a tiny delay to smooth out transitions
//     const timer = setTimeout(() => setChecking(false), 400);

//     return () => clearTimeout(timer);
//   }, [isLoaded, isSignedIn, segments]);

//   // ✅ Show loading splash while checking session
//   if (checking || !isLoaded) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: COLORS.white,
//         }}
//       >
//         <Image
//           source={require("../assets/images/icon.png")}
//           style={{ width: 100, height: 100, marginBottom: 20 }}
//           resizeMode="contain"
//         />
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={{ marginTop: 10, color: COLORS.primary, fontSize: 16 }}>
//           Setting up your account...
//         </Text>
//       </View>
//     );
//   }

//   return <Stack screenOptions={{ headerShown: false }} />;
// }


import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // Memoize auth screen check to avoid recalculating on every render
  const inAuthScreen = useMemo(() => segments[0] === "(auth)", [segments]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }

    // Use requestAnimationFrame for smoother low-end performance instead of setTimeout
    const frame = requestAnimationFrame(() => setChecking(false));

    return () => cancelAnimationFrame(frame);
  }, [isLoaded, isSignedIn, inAuthScreen, router]);

  // Show loading splash while checking session
  if (checking || !isLoaded) {
    return (
      <View style={styles.container}>
        <Image source={require("../assets/images/icon.png")} style={styles.icon} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Setting up your account...</Text>
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 16,
  },
});
