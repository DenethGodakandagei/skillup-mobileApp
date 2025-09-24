import { useRouter } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Button title="Open Map" onPress={() => router.push("/map")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
