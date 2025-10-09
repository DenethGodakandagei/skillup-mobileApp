import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function SSOCallback() {
  const router = useRouter();
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      // ✅ Navigate to main app tabs after Clerk session is loaded
      router.replace('/(tabs)');
    }
  }, [isLoaded]);

  return null; // no UI needed
}
