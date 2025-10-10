import { COLORS } from "@/constants/theme";
import { Tabs } from "expo-router";
import { BookOpen, Briefcase, Home, Upload, User } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

// 🔹 Reusable Icon Component with Animated Dot
function TabIcon({ Icon, color, size, focused }: any) {
  const dotAnim = useRef(new Animated.Value(0)).current; // initial opacity & translateY 0

  useEffect(() => {
    Animated.timing(dotAnim, {
      toValue: focused ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Icon
        color={color}
        size={size + (focused ? 3 : 0)}
        strokeWidth={focused ? 3 : 2}
      />
      <Animated.View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: COLORS.primary,
          marginTop: 4,
          opacity: dotAnim,
          transform: [
            {
              translateY: dotAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 0], // slide up slightly when appearing
              }),
            },
          ],
        }}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.darkGrey,
        tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopWidth: 0,
            position: "absolute",
            elevation: 10, // Android shadow
            height: 55,
            paddingTop:10,
            paddingBottom: 8,
            // 💡 iOS Shadow
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 }, // shadow above
            shadowOpacity: 0.2,
            shadowRadius: 6,
  },
}}

    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Home} color={color} size={size} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="isUpload"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Upload} color={color} size={size} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="myLearn"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={BookOpen} color={color} size={size} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={Briefcase} color={color} size={size} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon Icon={User} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
