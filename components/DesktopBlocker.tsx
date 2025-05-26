import { View, Platform, Dimensions } from 'react-native';
import { Text } from '~/components/ui/text';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/lib/constants';

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
          backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
        }}>
        <View className='flex-1 justify-center items-center px-8'>
          <View className='max-w-md items-center'>
            {/* App Icon/Logo */}
            <View
              className='w-20 h-20 rounded-full mb-8 justify-center items-center'
              style={{
                backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.primary : NAV_THEME.light.colors.primary,
              }}>
              <Text
                className='text-2xl'
                style={{
                  color: isDarkColorScheme ? NAV_THEME.dark.colors.background : NAV_THEME.light.colors.background,
                  fontFamily: 'Comfortaa_700Bold',
                }}>
                🍳
              </Text>
            </View>

            {/* Main Message */}
            <Text
              className='text-4xl text-center mb-6'
              style={{
                color: isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground,
                fontFamily: 'Comfortaa_700Bold',
              }}>
              CookApp
            </Text>

            <Text
              className='text-xl font-semibold text-center mb-4'
              style={{
                color: isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground,
                fontFamily: 'Comfortaa_600SemiBold',
              }}>
              Mobile Only Experience
            </Text>

            <Text
              className='text-lg text-center mb-8 opacity-80 leading-relaxed'
              style={{
                color: isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground,
                fontFamily: 'Comfortaa_400Regular',
              }}>
              CookApp is designed exclusively for mobile devices. Please access this app from your smartphone or tablet
              for the best cooking experience.
            </Text>

            {/* Instructions */}
            <View
              className='w-full p-6 rounded-xl border border-opacity-20 mb-6'
              style={{
                borderColor: isDarkColorScheme ? NAV_THEME.dark.colors.border : NAV_THEME.light.colors.border,
                backgroundColor: isDarkColorScheme ? NAV_THEME.dark.colors.card : NAV_THEME.light.colors.card,
              }}>
              <Text
                className='text-lg font-semibold mb-3 text-center'
                style={{
                  color: isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground,
                  fontFamily: 'Comfortaa_600SemiBold',
                }}>
                How to Access CookApp:
              </Text>

              <View className='space-y-2'>
                <Text
                  className='text-base opacity-90'
                  style={{
                    color: isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground,
                    fontFamily: 'Comfortaa_400Regular',
                  }}>
                  📱 Open this URL on your mobile device
                </Text>
                <Text
                  className='text-base opacity-90'
                  style={{
                    color: isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground,
                    fontFamily: 'Comfortaa_400Regular',
                  }}>
                  📧 Send yourself the link via email/text
                </Text>
              </View>
            </View>

            {/* Footer */}
            <Text
              className='text-sm opacity-60 text-center'
              style={{
                color: isDarkColorScheme ? NAV_THEME.dark.colors.foreground : NAV_THEME.light.colors.foreground,
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
