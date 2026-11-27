import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function formaterDuree(secondes) {
  const m = Math.floor(secondes / 60);
  const s = String(secondes % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function FicheAlbum() {
  const { id } = useLocalSearchParams();
  const [album, setAlbum] = useState(null);
  const [source, setSource] = useState(null);
  const [enCours, setEnCours] = useState(null);
  const player = useAudioPlayer(source);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
    async function charger() {
      try {
        const reponse = await fetch(`https://api.deezer.com/album/${id}`);
        const data = await reponse.json();
        setAlbum(data);
      } catch (e) {
        setAlbum({ error: true });
      }
    }
    charger();
  }, [id]);

  // lance l'extrait dès que la source change
  useEffect(() => {
    if (source) {
      player.seekTo(0);
      player.play();
    }
  }, [source]);

  if (album === null) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color="#e5484d" />
      </View>
    );
  }

  if (album.error) {
    return (
      <View style={styles.centre}>
        <Text style={styles.message}>Album introuvable</Text>
      </View>
    );
  }

  const date = new Date(album.release_date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function jouer(titre) {
    if (enCours === titre.id) {
      player.pause();
      setEnCours(null);
    } else {
      setEnCours(titre.id);
      setSource(titre.preview);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: album.title,
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "#fff",
        }}
      />
      <FlatList
        style={styles.liste}
        data={album.tracks.data}
        keyExtractor={(item) => String(item.id)}
        extraData={enCours}
        ListHeaderComponent={
          <View style={styles.entete}>
            <View style={styles.ombre}>
              <Image source={{ uri: album.cover_big }} style={styles.cover} />
            </View>
            <Text style={styles.titre}>{album.title}</Text>
            <Text style={styles.artiste}>{album.artist.name}</Text>
            <Text style={styles.infos}>
              {date} · {album.nb_tracks} titres
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const actif = enCours === item.id;
          return (
            <Pressable
              onPress={() => jouer(item)}
              style={({ pressed }) => [
                styles.ligne,
                actif && styles.ligneActive,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={[styles.numero, actif && styles.texteActif]}>
                {index + 1}
              </Text>
              <View style={styles.texteBloc}>
                <Text
                  style={[styles.nomTitre, actif && styles.texteActif]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={styles.duree}>{formaterDuree(item.duration)}</Text>
              </View>
              <View style={[styles.bouton, actif && styles.boutonActif]}>
                <Text style={styles.boutonTexte}>{actif ? "⏸" : "▶"}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centre: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
  },
  message: { color: "#fff", fontSize: 18 },
  liste: { backgroundColor: "#121212" },

  entete: { alignItems: "center", padding: 24, paddingBottom: 16 },
  ombre: {
    borderRadius: 16,
    backgroundColor: "#121212",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  cover: { width: 260, height: 260, borderRadius: 16 },
  titre: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: 24,
    textAlign: "center",
  },
  artiste: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e5484d",
    marginTop: 6,
  },
  infos: { color: "#999", marginTop: 6 },

  ligne: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 14,
  },
  ligneActive: { backgroundColor: "#1e1e1e" },
  numero: { color: "#888", width: 24, textAlign: "center" },
  texteBloc: { flex: 1 },
  nomTitre: { color: "#fff", fontSize: 16 },
  duree: { color: "#888", fontSize: 13, marginTop: 2 },
  texteActif: { color: "#e5484d", fontWeight: "bold" },

  bouton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  boutonActif: { backgroundColor: "#e5484d" },
  boutonTexte: { color: "#fff", fontSize: 14 },
});
