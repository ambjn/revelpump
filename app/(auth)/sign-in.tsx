import React from 'react';

import { Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { AntDesign, Ionicons } from '@expo/vector-icons';

import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Page() {
  const { isLoaded } = useSignIn();
  const router = useRouter();

  const { startSSOFlow } = useSSO();
  const [error, setError] = React.useState('');

  const onSignInPress = async (strategy: 'oauth_google' | 'oauth_apple') => {
    if (!isLoaded) return;

    setError('');

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: strategy,
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
      } else {
        setError('Login incomplete. Please try again.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setError(err?.errors?.[0]?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/tangled.jpg')}
      className="flex-1"
      resizeMode="cover">
      <SafeAreaView className="flex-1 bg-gray-800/40">
        <View className="mt-25 flex-1 justify-between px-6">
          <Text className="text-6xl text-white/90" style={{ fontFamily: 'ElmsSans-Bold' }}>
            Welcome⛽️
          </Text>

          <View>
            {error ? (
              <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
                <Text
                  className="text-sm lowercase text-red-700"
                  style={{ fontFamily: 'ElmsSans-Regular' }}>
                  {error}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              onPress={() => onSignInPress('oauth_google')}
              disabled={!isLoaded}
              className="rounded-xl border-2 border-gray-300 bg-white px-6 py-4 shadow-sm"
              style={{ opacity: !isLoaded ? 0.5 : 1 }}>
              <View className="flex-row items-center justify-center">
                <AntDesign name="google" size={24} style={{ marginRight: 12 }} />
                <Text
                  className="text-center text-lg font-semibold text-gray-900"
                  style={{ fontFamily: 'ElmsSans-Regular' }}>
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>

            {/* Apple Sign In Button */}
            <TouchableOpacity
              onPress={() => onSignInPress('oauth_apple')}
              disabled={!isLoaded}
              className="mt-4 rounded-xl border-2 border-gray-900 bg-gray-900 px-6 py-4 shadow-sm"
              style={{ opacity: !isLoaded ? 0.5 : 1 }}>
              <View className="flex-row items-center justify-center">
                <Ionicons name="logo-apple" size={24} color="#FFFFFF" style={{ marginRight: 12 }} />
                <Text
                  className="text-center text-lg font-semibold text-white"
                  style={{ fontFamily: 'ElmsSans-Regular' }}>
                  Continue with Apple
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
