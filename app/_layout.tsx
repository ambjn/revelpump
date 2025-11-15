import '../global.css';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
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
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
