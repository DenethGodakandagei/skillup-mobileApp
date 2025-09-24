import { COLORS } from "@/constants/theme";
import { ActivityIndicator, View } from "react-native";

export function Loader() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.surface,
      }}
    >
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
