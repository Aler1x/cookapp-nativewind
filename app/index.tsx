import { Platform, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { View } from '~/components/ui/view';
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';
import { useUser } from '@clerk/clerk-expo';

const LandingScreen = () => {
  const { isDarkColorScheme } = useColorScheme();

  useEffect(() => {
    // Redirect native mobile users to home tabs automatically
    if (Platform.OS !== 'web') {
      const timer = setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const { user } = useUser();

  // For native mobile, show loading screen
  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
        }}>
        <View className='flex-1 justify-center items-center px-6'>
          <Text className='text-4xl mb-4 font-bold'>CookApp</Text>
          <Text className='text-lg opacity-70'>Loading your recipes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mobile web landing page (desktop is blocked at root level)
  return (
    <SafeAreaView
      className='flex-1'
      style={{
        backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
      }}>
      <ScrollView className='flex-1 min-h-screen'>
        {/* Mobile Header */}
        <View className='flex-row justify-between items-center px-4 py-4 border-b border-opacity-10 sticky top-0 bg-background z-10'>
          <Text className='text-2xl font-bold'>CookApp</Text>

          {/* App would be soon available on the app store */}
          <Button onPress={() => router.push('/(tabs)/home')} className='px-4 py-2 rounded-full'>
            <Text className='text-sm font-semibold'>Join the waitlist</Text>
          </Button>
        </View>

        {/* Mobile Hero Section */}
        <View className='flex-1 justify-center items-center px-4 py-8'>
          <View className='w-full items-center'>
            <Text className='text-4xl text-center mb-6 leading-tight font-bold'>Your Kitchen, Your Rules</Text>
            <Text className='text-lg text-center mb-8 opacity-80 leading-relaxed px-2'>
              Discover, create, and organize your favorite recipes. Build your personal cookbook and never lose a recipe
              again.
            </Text>

            <View className='w-full px-4'>
              <Button onPress={() => router.push('/(tabs)/home')} className='w-full py-4 rounded-full shadow-lg mb-4'>
                <Text className='text-lg font-semibold text-center'>Start Cooking</Text>
              </Button>

              {user && (
                <Button
                  variant='outline'
                  onPress={() => router.push('/(tabs)/profile?showPremium=true')}
                  className='w-full py-4 rounded-full mb-4'>
                  <Text className='text-lg font-semibold text-center'>View Premium Features</Text>
                </Button>
              )}
            </View>
          </View>
        </View>

        {/* Mobile Features Section */}
        <View className='px-4 py-8 border-t border-opacity-10'>
          <Text className='text-2xl text-center mb-4 font-bold'>Everything you need to cook</Text>

          <View className='flex flex-col gap-3'>
            {[
              {
                title: 'Discover Recipes',
                description: 'Find new recipes tailored to your taste',
                bgColor: '#ADD6CF',
              },
              {
                title: 'Create & Save',
                description: 'Build your personal recipe collection',
                bgColor: '#9FB693',
              },
              {
                title: 'Smart Shopping',
                description: 'Add ingredients to your shopping list',
                bgColor: '#F8E8C4',
              },
              {
                title: 'Organize Library',
                description: 'Keep your recipes perfectly organized',
                bgColor: '#F0AF9E',
              },
            ].map((feature, index) => (
              <View
                key={index}
                className='p-4 rounded-xl border border-opacity-10'
                style={{ backgroundColor: feature.bgColor }}>
                <Text className='text-lg mb-2 font-semibold'>{feature.title}</Text>
                <Text className='leading-relaxed'>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;
