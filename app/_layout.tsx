import InitialLayout from "@/components/InitialLayout";
import { COLORS } from "@/constants/theme";
import { AppProvider } from "@/context/AppContext";
import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey){
  throw new Error("Missing publishable key!");
  
}

export default function RootLayout() {

  return(
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
          <AppProvider>
          <InitialLayout/>
          </AppProvider>
        </SafeAreaView>
      </SafeAreaProvider>
     </ClerkAndConvexProvider>
  );
}
