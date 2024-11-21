import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" />
      <Stack.Screen name="job-details" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
