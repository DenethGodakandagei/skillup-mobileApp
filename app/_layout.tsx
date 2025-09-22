import InitialLayout from "@/components/InitialLayout";
import { COLORS } from "@/constants/theme";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import CourseDetails from "./screens/course-details";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey){
  throw new Error("Missing publishable key!");
  
}

export default function RootLayout() {

  return(
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
          <InitialLayout>
            <Stack>
              <Stack.Screen name="CourseDetails" component={CourseDetails} />
            </Stack>
          </InitialLayout>
        </SafeAreaView>
      </SafeAreaProvider>
     </ClerkAndConvexProvider>
  );
}
