import React, { useEffect, useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Image } from '~/components/ui/image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { TouchableOpacity, Pressable, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import AuthPage from '~/components/pages/auth';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import PreferencesPage from '~/components/modals/preferences';
import { UserPen, ChevronRight, Heart, CookingPot, Palette, HelpCircle } from '~/assets/icons';
import { Preferences } from '~/types/profile';
import PremiumPage from '~/components/modals/premium';
import Toast from 'react-native-toast-message';

export default function ProfilePage() {
  const { signOut, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  const { showPremium: showPremiumParam } = useLocalSearchParams();

  useEffect(() => {
    if (showPremiumParam) {
      setShowPremium(true);
    }
  }, [showPremiumParam]);

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

  const { getToken } = useAuth();

  const handleCopyToken = async () => {
    if (!isSignedIn) {
      return;
    }

    const token = await getToken();
    if (token) {
      navigator.clipboard.writeText(token);
    }

    Toast.show({
      text1: 'Token copied to clipboard',
    });
  };

  const handleClickPlan = (plan: string) => {
    user?.update({
      unsafeMetadata: {
        isPremium: true,
        plan: plan,
      },
    });

    Toast.show({
      text1: `You are now on the ${plan} plan`,
      type: 'success',
    });

    setShowPremium(false);
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
                <Text
                  className='text-sm text-gray-500 font-regular max-w-[60vw]'
                  numberOfLines={1}
                  ellipsizeMode='middle'>
                  {user?.emailAddresses[0].emailAddress}
                </Text>
              </View>
            </View>

            {process.env.NODE_ENV === 'development' && (
              <Button variant='outline' size='icon' className='w-10 h-10 border-gray-500' onPress={handleCopyToken}>
                <UserPen size={24} />
              </Button>
            )}
          </View>
          <View>
            {user?.unsafeMetadata.isPremium ? (
              <View className='flex-row items-center justify-between bg-[hsl(170,33%,76%)] rounded-3xl py-4 px-6 mb-4'>
                <View className='flex-row items-center gap-4'>
                  <View className='w-12 h-12 bg-white rounded-full items-center justify-center'>
                    <CookingPot size={24} color='#4b5563' />
                  </View>
                  <View>
                    <Text className='text-lg font-bold text-gray-800 text-wrap max-w-[60vw]'>
                      Your Premium Plan is Active
                    </Text>
                    <Text className='text-sm text-gray-600 text-wrap max-w-[60vw]'>
                      You have access to all features
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                className='flex-row items-center justify-between bg-[hsl(170,33%,76%)] rounded-3xl py-4 px-6 mb-4'
                onPress={() => setShowPremium(true)}>
                <View className='flex-row items-center gap-4'>
                  <View className='w-12 h-12 bg-white rounded-full items-center justify-center'>
                    <CookingPot size={24} color='#4b5563' />
                  </View>
                  <View>
                    <Text className='text-lg font-bold text-gray-800 text-wrap max-w-[60vw]'>Buy Premium</Text>
                    <Text className='text-sm text-gray-600 text-wrap max-w-[60vw]'>Unlock all features</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {/* <Link href='/profile/settings' asChild>
              <Pressable className='flex-row items-center justify-between border-b border-gray-500 py-6 px-4'>
              <View className='flex-row items-center gap-4'>
              <View className='w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center'>
              <SettingsIcon size={24} color='#666' />
              </View>
              <Text className='text-lg font-semibold'>Settings</Text>
              </View>
              <ChevronRight size={24} color='#666' />
              </Pressable>
              </Link> */}

            <TouchableOpacity
              onPress={() => setShowPreferences(true)}
              className='flex-row items-center justify-between border-b border-gray-500 py-6 px-4'>
              <View className='flex-row items-center gap-4'>
                <View className='w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center'>
                  <Heart size={24} color='#666' />
                </View>
                <Text className='text-lg font-semibold'>Preferences</Text>
              </View>
              <ChevronRight size={24} color='#666' />
            </TouchableOpacity>

            <Link href='/profile/my-recipes' asChild>
              <Pressable className='flex-row items-center justify-between border-b border-gray-500 py-6 px-4'>
                <View className='flex-row items-center gap-4'>
                  <View className='w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center'>
                    <CookingPot size={24} color='#666' />
                  </View>
                  <Text className='text-lg font-semibold'>My Recipes</Text>
                </View>
                <ChevronRight size={24} color='#666' />
              </Pressable>
            </Link>

            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:support@cookapp.ai?subject=Support Request')}
              className='flex-row items-center justify-between border-b border-gray-500 py-6 px-4'>
              <View className='flex-row items-center gap-4'>
                <View className='w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center'>
                  <HelpCircle size={24} color='#666' />
                </View>
                <Text className='text-lg font-semibold'>Support</Text>
              </View>
              <ChevronRight size={24} color='#666' />
            </TouchableOpacity>

            {/* {process.env.NODE_ENV === 'development' && (
              <Link href='/design/go-back' asChild>
              <Pressable className='flex-row items-center justify-between border-b border-gray-500 py-6 px-4'>
              <View className='flex-row items-center gap-4'>
              <View className='w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center'>
              <Palette size={24} color='#666' />
                    </View>
                    <Text className='text-lg font-semibold'>Design</Text>
                  </View>
                  <ChevronRight size={24} color='#666' />
                  </Pressable>
                  </Link>
                  )} */}
          </View>

          <FullscreenModal visible={showPremium} onClose={() => setShowPremium(false)}>
            <PremiumPage onClose={() => setShowPremium(false)} onClickPlan={handleClickPlan} />
          </FullscreenModal>

          <FullscreenModal visible={showPreferences} onClose={() => setShowPreferences(false)}>
            <PreferencesPage onClose={() => setShowPreferences(false)} />
          </FullscreenModal>
        </SafeAreaView>
      )}
    </>
  );
}
