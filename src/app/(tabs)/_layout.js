import { Tabs } from "expo-router";
export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Découverte" }} />
      <Tabs.Screen name="profil" options={{ title: "Profil" }} />
      <Tabs.Screen name="profil" options={{ title: "Librairie" }} />
    </Tabs>
  );
}
Pokédex;
