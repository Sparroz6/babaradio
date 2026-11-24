import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

export default function Test() {
  const [track, setTrack] = useState(null);
  const player = useAudioPlayer(track?.preview);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
    async function charger() {
      const reponse = await fetch("https://api.deezer.com/track/2150228");
      const data = await reponse.json();
      setTrack(data);
    }
    charger();
  }, []);

  if (track === null) {
    return <ActivityIndicator size="large" style={{ marginTop: 60 }} />;
  }

  return (
    <View style={{ flex: 1, alignItems: "center", paddingTop: 80 }}>
      <Pressable
        onPress={() => {
          player.seekTo(0);
          player.play();
        }}
        style={{ alignItems: "center" }}
      >
        <Image
          source={{ uri: track.album.cover_big }}
          style={{ width: 250, height: 250 }}
        />
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 16 }}>
          {track.title}
        </Text>
        <Text style={{ color: "#888" }}>{track.artist.name}</Text>
        <Text style={{ marginTop: 16 }}>▶ Toucher pour écouter l'extrait</Text>
      </Pressable>
    </View>
  );
}
