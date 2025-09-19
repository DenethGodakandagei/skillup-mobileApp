import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/auth.styles";

export default function Index() {

  const {signOut} = useAuth();

  return (
    <View style={styles.container}>
      <Text>Hello This is Home Screen</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style = {{color: "red"}}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
