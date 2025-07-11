import { View, Platform, Dimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import { THEME } from '~/lib/constants';

interface DesktopBlockerProps {
  children: React.ReactNode;
}

const DesktopBlocker: React.FC<DesktopBlockerProps> = ({ children }) => {
  const { isDarkColorScheme } = useColorScheme();
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const isDesktopWeb = Platform.OS === 'web' && screenData.width > 768;

  // If it's desktop web, show blocking message
  if (isDesktopWeb) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
        }}>
        <View className='flex-1 items-center justify-center px-8'>
          <View className='max-w-md items-center'>
            {/* App Icon/Logo */}
            <View
              className='mb-8 h-20 w-20 items-center justify-center rounded-full'
              style={{
                backgroundColor: isDarkColorScheme ? THEME.dark.colors.primary : THEME.light.colors.primary,
              }}>
              <Text
                className='text-2xl'
                style={{
                  color: isDarkColorScheme ? THEME.dark.colors.background : THEME.light.colors.background,
                  fontFamily: 'Comfortaa_700Bold',
                }}>
                🍳
              </Text>
            </View>

            {/* Main Message */}
            <Text
              className='mb-6 text-center text-4xl'
              style={{
                color: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
                fontFamily: 'Comfortaa_700Bold',
              }}>
              CookApp
            </Text>

            <Text
              className='mb-4 text-center text-xl font-semibold'
              style={{
                color: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
                fontFamily: 'Comfortaa_600SemiBold',
              }}>
              Mobile Only Experience
            </Text>

            <Text
              className='mb-8 text-center text-lg leading-relaxed opacity-80'
              style={{
                color: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
                fontFamily: 'Comfortaa_400Regular',
              }}>
              CookApp is designed exclusively for mobile devices. Please access this app from your smartphone or tablet
              for the best cooking experience.
            </Text>

            {/* Instructions */}
            <View
              className='mb-6 w-full rounded-xl border border-opacity-20 p-6'
              style={{
                borderColor: isDarkColorScheme ? THEME.dark.colors.border : THEME.light.colors.border,
                backgroundColor: isDarkColorScheme ? THEME.dark.colors.card : THEME.light.colors.card,
              }}>
              <Text
                className='mb-3 text-center text-lg font-semibold'
                style={{
                  color: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
                  fontFamily: 'Comfortaa_600SemiBold',
                }}>
                How to Access CookApp:
              </Text>

              <View className='space-y-2'>
                <Text
                  className='text-base opacity-90'
                  style={{
                    color: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
                    fontFamily: 'Comfortaa_400Regular',
                  }}>
                  📱 Open this URL on your mobile device
                </Text>
                <Text
                  className='text-base opacity-90'
                  style={{
                    color: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
                    fontFamily: 'Comfortaa_400Regular',
                  }}>
                  📧 Send yourself the link via email/text
                </Text>
              </View>
            </View>

            {/* Footer */}
            <Text
              className='text-center text-sm opacity-60'
              style={{
                color: isDarkColorScheme ? THEME.dark.colors.foreground : THEME.light.colors.foreground,
                fontFamily: 'Comfortaa_300Light',
              }}>
              Optimized for mobile cooking experiences
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // For mobile/native, render the app normally
  return <>{children}</>;
};

export default DesktopBlocker;
