import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
const GENRES = [
  { id: 464, nom: "Metal" },
  { id: 173, nom: "Jeux Vidéo/Films" },
  { id: 152, nom: "Rock" },
];

export default function Albums() {
  const [genre, setGenre] = useState(GENRES[0].id);
  const [albums, setAlbums] = useState(null);

  useEffect(() => {
    async function charger() {
      setAlbums(null);
      try {
        const reponse = await fetch(
          `https://api.deezer.com/chart/${genre}/albums`,
        );
        const data = await reponse.json();
        setAlbums(data.data ?? []);
      } catch (e) {
        setAlbums([]);
      }
    }
    charger();
  }, [genre]);

  return (
    // Boutons pour les genres musicaux
    <View style={{ flex: 1, paddingTop: 60 }}>
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 16 }}>
        {GENRES.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => setGenre(g.id)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 999,
              backgroundColor: genre === g.id ? "#2a2a2a" : "#e0e0e0",
            }}
          >
            <Text
              style={{
                color: genre === g.id ? "#fff" : "#2a2a2a",
                fontWeight: "bold",
              }}
            >
              {g.nom}
            </Text>
          </Pressable>
        ))}
      </View>
      // ------------------------------------- // Montrez les albums
      {albums === null ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={albums}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                maxWidth: "48%",
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <Image
                source={{ uri: item.cover_big }}
                style={{ width: "100%", aspectRatio: 1, borderRadius: 8 }}
              />
              <Text
                style={{ fontWeight: "bold", marginTop: 8 }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={{ color: "#888" }} numberOfLines={1}>
                {item.artist.name}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
