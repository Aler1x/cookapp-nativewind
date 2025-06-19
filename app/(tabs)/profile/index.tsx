import React, { useEffect, useState } from 'react';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { Image } from '~/components/ui/image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { TouchableOpacity, Pressable, Linking } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import AuthPage from '~/components/pages/auth';
import FullscreenModal from '~/components/ui/fullscreen-modal';
import PreferencesPage from '~/components/modals/preferences';
import { UserPen, ChevronRight, Heart, CookingPot, HelpCircle, Palette, Settings } from '~/assets/icons';
import PremiumPage from '~/components/modals/premium';
import Toast from 'react-native-toast-message';
import { EXPO_DEV } from '~/lib/constants';

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
        <SafeAreaView className='flex-1 gap-4' style={{ padding: 16 }} edges={['top']}>
          <Text className='text-3xl font-bold'>Profile</Text>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-4'>
              <Image source={user?.imageUrl} className='h-16 w-16 rounded-full' />
              <View>
                <Text className='text-lg font-semibold'>{user?.fullName}</Text>
                <Text
                  className='font-regular max-w-[60vw] text-sm text-gray-500'
                  numberOfLines={1}
                  ellipsizeMode='middle'>
                  {user?.emailAddresses[0].emailAddress}
                </Text>
              </View>
            </View>

            {EXPO_DEV && (
              <Button variant='outline' size='icon' className='h-10 w-10 border-gray-500' onPress={handleSignOut}>
                <UserPen size={24} />
              </Button>
            )}
          </View>
          <View>
            {user?.unsafeMetadata.isPremium ? (
              <View className='mb-4 flex-row items-center justify-between rounded-3xl bg-[hsl(170,33%,76%)] px-6 py-4'>
                <View className='flex-row items-center gap-4'>
                  <View className='h-12 w-12 items-center justify-center rounded-full bg-white'>
                    <CookingPot size={24} color='#4b5563' />
                  </View>
                  <View>
                    <Text className='max-w-[65vw] text-wrap text-lg font-bold text-gray-800'>
                      Your Premium Plan is Active
                    </Text>
                    <Text className='max-w-[60vw] text-wrap text-sm text-gray-600'>
                      You have access to all features
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                className='mb-4 flex-row items-center justify-between rounded-3xl bg-[hsl(170,33%,76%)] px-6 py-4'
                onPress={() => setShowPremium(true)}>
                <View className='flex-row items-center gap-4'>
                  <View className='h-12 w-12 items-center justify-center rounded-full bg-white'>
                    <CookingPot size={24} color='#4b5563' />
                  </View>
                  <View>
                    <Text className='max-w-[60vw] text-wrap text-lg font-bold text-gray-800'>Buy Premium</Text>
                    <Text className='max-w-[60vw] text-wrap text-sm text-gray-600'>Unlock all features</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            {EXPO_DEV && (
              <>
                <Link href='/profile/settings' asChild>
                  <Pressable className='flex-row items-center justify-between border-b border-gray-500 py-6 px-4'>
                    <View className='flex-row items-center gap-4'>
                      <View className='w-14 h-14 bg-gray-200 rounded-2xl items-center justify-center'>
                        <Settings size={24} color='#666' />
                      </View>
                      <Text className='text-lg font-semibold'>Settings</Text>
                    </View>
                    <ChevronRight size={24} color='#666' />
                  </Pressable>
                </Link>

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
              </>
            )}

            <TouchableOpacity
              onPress={() => setShowPreferences(true)}
              className='flex-row items-center justify-between border-b border-gray-500 px-4 py-6'>
              <View className='flex-row items-center gap-4'>
                <View className='h-14 w-14 items-center justify-center rounded-2xl bg-gray-200'>
                  <Heart size={24} color='#666' />
                </View>
                <Text className='text-lg font-semibold'>Preferences</Text>
              </View>
              <ChevronRight size={24} color='#666' />
            </TouchableOpacity>

            <Link href='/profile/my-recipes' asChild>
              <Pressable className='flex-row items-center justify-between border-b border-gray-500 px-4 py-6'>
                <View className='flex-row items-center gap-4'>
                  <View className='h-14 w-14 items-center justify-center rounded-2xl bg-gray-200'>
                    <CookingPot size={24} color='#666' />
                  </View>
                  <Text className='text-lg font-semibold'>My Recipes</Text>
                </View>
                <ChevronRight size={24} color='#666' />
              </Pressable>
            </Link>

            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:support@cookapp.ai?subject=Support Request')}
              className='flex-row items-center justify-between border-b border-gray-500 px-4 py-6'>
              <View className='flex-row items-center gap-4'>
                <View className='h-14 w-14 items-center justify-center rounded-2xl bg-gray-200'>
                  <HelpCircle size={24} color='#666' />
                </View>
                <Text className='text-lg font-semibold'>Support</Text>
              </View>
              <ChevronRight size={24} color='#666' />
            </TouchableOpacity>
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
