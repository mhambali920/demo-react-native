import { useAuthSession } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import { ReactNode } from "react";
import { ThemedText } from "@/components/ThemedText";

export default function RootLayout(): ReactNode {
  const { token, isLoading } = useAuthSession();

  if (isLoading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  if (!token?.current) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
