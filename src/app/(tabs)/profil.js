import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Profil() {
  return (
    <View style={{ flex: 1, paddingTop: 60, alignItems: "center" }}>
      <Pressable
        onPress={() => router.push("/album/1110711872")}
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#2a2a2a",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Tester la page album
        </Text>
      </Pressable>
    </View>
  );
}
