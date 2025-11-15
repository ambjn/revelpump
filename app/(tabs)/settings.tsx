import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="border-b border-gray-200 bg-white px-5 pb-4 pt-16">
        <Text className="text-4xl text-gray-900" style={{ fontFamily: 'ElmsSans-SemiBold' }}>
          Settings⚙️
        </Text>
        <Text className="mt-2 text-2xl text-gray-500" style={{ fontFamily: 'ElmsSans-SemiBold' }}>
          Manage your RevelPump⛽️ account
        </Text>
      </View>

      <View className="mx-5 mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <View className="items-center">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="h-24 w-24 rounded-full border-4 border-blue-500"
              resizeMode="cover"
            />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-blue-500 bg-gray-200">
              <Ionicons name="person" size={48} color="#6b7280" />
            </View>
          )}

          <Text
            className="mt-4 text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'ElmsSans-SemiBold' }}>
            {user?.fullName || 'User'}
          </Text>

          <Text className="mt-1 text-lg text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
      </View>

      <View className="mx-5 mt-6">
        <Text
          className="mb-3 text-base font-semibold uppercase text-gray-500"
          style={{ fontFamily: 'ElmsSans-Regular' }}>
          Account Details
        </Text>

        <View className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-5">
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={24} color="#6b7280" />
              <Text
                className="ml-3 text-lg text-gray-700"
                style={{ fontFamily: 'ElmsSans-Regular' }}>
                User ID
              </Text>
            </View>
            <Text className="text-base text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              {user?.id.substring(0, 15)}...
            </Text>
          </View>

          <View className="flex-row items-center justify-between px-4 py-5">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={24} color="#6b7280" />
              <Text
                className="ml-3 text-lg text-gray-700"
                style={{ fontFamily: 'ElmsSans-Regular' }}>
                Member Since
              </Text>
            </View>
            <Text className="text-base text-gray-500" style={{ fontFamily: 'ElmsSans-Regular' }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View className="mx-5 mb-8 mt-6">
        <TouchableOpacity
          onPress={handleSignOut}
          className="rounded-xl bg-red-500 px-6 py-5 shadow-lg">
          <View className="flex-row items-center justify-center">
            <MaterialIcons name="logout" size={28} color="#FFFFFF" />
            <Text
              className="ml-3 text-center text-xl font-semibold text-white"
              style={{ fontFamily: 'ElmsSans-Regular' }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
