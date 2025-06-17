import { router, Stack } from 'expo-router';
import { View } from '~/components/ui/view';
import { Text } from '~/components/ui/text';
import { TouchableOpacity } from 'react-native';
import { ChevronLeft, Croissant } from '~/assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModalProvider, useModal } from '~/contexts/modal-context';

function HeaderContent(props: any) {
  const { setShowJobsModal } = useModal();

  const handleCroissantPress = () => {
    // Navigate to my-recipes if not already there
    if (props.route?.name !== 'my-recipes') {
      router.push('(tabs)/profile/my-recipes');
    }
    // Show the jobs modal
    setShowJobsModal(true);
  };

  return (
    <SafeAreaView edges={['top']}>
      <View className='flex-row items-center justify-between bg-background px-4 py-2'>
        <TouchableOpacity
          onPress={() => router.push('(tabs)/profile')}
          className='h-10 w-10 flex-row items-center gap-2'>
          <ChevronLeft size={24} color='#000' />
        </TouchableOpacity>
        <Text className='text-lg font-semibold'>{props.options.title}</Text>
        <TouchableOpacity onPress={handleCroissantPress} className='h-10 w-10 items-center justify-center'>
          <Croissant size={24} color='#000' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function Layout() {
  return (
    <ModalProvider>
      <Stack
        screenOptions={{
          header(props) {
            return <HeaderContent {...props} />;
          },
        }}>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='settings' options={{ title: 'Settings' }} />
        <Stack.Screen name='my-recipes' options={{ title: 'My Recipes' }} />
      </Stack>
    </ModalProvider>
  );
}
