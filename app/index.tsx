import { Stack } from 'expo-router';

import { View } from 'react-native';

export default function Home() {
  return (
    <View className="flex flex-1 bg-amber-500">
      <Stack.Screen options={{ title: 'Home' }} />
    </View>
  );
}
