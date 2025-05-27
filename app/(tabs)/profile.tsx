import React, { useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Image } from '~/components/ui/image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from '~/components/ui/button-link';
import { Button } from '~/components/ui/button';
import { TouchableOpacity } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import AuthPage from '~/components/pages/auth';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import PreferencesPage from '~/components/pages/preferences';
import { UserPen, ChevronRight, Settings, Heart } from '~/assets/icons';
import { Preferences } from '~/types/profile';

export default function Page() {
  const { signOut, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const handleSignOut = async () => {
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = (preferences: Preferences) => {
    console.log('Preferences saved:', preferences);
    // Here you would make an API call to save preferences
    setShowPreferences(false);
  };

  return (
    <>
      {!isSignedIn && <AuthPage />}
      {isSignedIn && (
        <SafeAreaView className='flex-1 gap-4' style={{ padding: 16 }}>
          <Text className='text-3xl font-bold'>Profile</Text>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-4'>
              <Image source={user?.imageUrl} className='w-16 h-16 rounded-full' />
              <View>
                <Text className='text-lg font-semibold'>{user?.fullName}</Text>
                <Text className='text-sm text-gray-500 font-regular'>{user?.emailAddresses[0].emailAddress}</Text>
              </View>
            </View>
            <Button variant='outline' size='icon' className='w-10 h-10'>
              <UserPen size={24} />
            </Button>
          </View>
          <View>
            <TouchableOpacity className='flex-row items-center justify-between bg-[hsl(170,33%,76%)] rounded-3xl py-4 px-6 mb-4'>
              <View className='flex-row items-center gap-4'>
                <View className='w-12 h-12 bg-white rounded-full items-center justify-center'>
                  <Text className='text-2xl'>🍙</Text>
                </View>
                <View>
                  <Text className='text-lg font-comfortaa-semibold text-gray-800'>Buy Premium</Text>
                  <Text className='text-sm text-gray-600'>Unlock all features</Text>
                </View>
              </View>
              <ChevronRight size={24} color='#374151' />
            </TouchableOpacity>

            {/* <Link href='/profile/settings' variant='ghost' className='items-center justify-between border-b'>
              <View className='flex-row items-center gap-4'>
                <View className='w-10 h-10 bg-gray-200 rounded-lg items-center justify-center'>
                  <Settings size={20} color="#666" />
                </View>
                <Text className='text-lg font-comfortaa-semibold'>Settings</Text>
              </View>
              <ChevronRight size={24} color="#666" />
            </Link> */}

            <TouchableOpacity
              onPress={() => setShowPreferences(true)}
              className='flex-row items-center justify-between border-b border-gray-500 py-6 px-4'>
              <View className='flex-row items-center gap-4'>
                <View className='w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center'>
                  <Heart size={20} color='#666' />
                </View>
                <Text className='text-lg font-comfortaa-semibold'>Preferences</Text>
              </View>
              <ChevronRight size={24} color='#666' />
            </TouchableOpacity>
          </View>

          <FullscreenModal visible={showPreferences} onClose={() => setShowPreferences(false)}>
            <PreferencesPage onClose={() => setShowPreferences(false)} onSave={handleSavePreferences} />
          </FullscreenModal>
        </SafeAreaView>
      )}
    </>
  );
}
