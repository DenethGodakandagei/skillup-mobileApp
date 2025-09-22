import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

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
            elevation: 0,
            height: 40,
            paddingBottom: 8,
        }
    }}
   >
        <Tabs.Screen name="index"
            options={{
                tabBarIcon: ({color, size}) => <Ionicons name = "home" size={size} color={color}/>,
            }}
        />
        <Tabs.Screen name="findSkill"
         options={{
                tabBarIcon: ({color, size}) => <Ionicons name = "bulb" size={size} color={color}/>,
            }}
        />
        
        <Tabs.Screen name="myLearn"
         options={{
                tabBarIcon: ({color, size}) => <Ionicons name = "book" size={size} color={color}/>,
            }}
        />
        <Tabs.Screen name="profile"
            options={{
                tabBarIcon: ({color, size}) => <Ionicons name = "person-circle" size={size} color={color}/>,
            }}
        />
   </Tabs>
  )
}