import '../global.css';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

const RootStack = () => {
  const { isSignedIn, isLoaded } = useAuth();

  const [loaded, error] = useFonts({
    'ElmsSans-Regular': require('../assets/fonts/ElmsSans-Regular.ttf'),
    'ElmsSans-Bold': require('../assets/fonts/ElmsSans-Bold.ttf'),
    'ElmsSans-SemiBold': require('../assets/fonts/ElmsSans-SemiBold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* for testing */}
      {/* <Stack.Screen name="(tabs)" /> */}

      <Stack.Protected guard={!!isSignedIn}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)/sign-in" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <RootStack />
    </ClerkProvider>
  );
}
