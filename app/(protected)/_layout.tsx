import { Stack } from "expo-router";

export default function protectedLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
