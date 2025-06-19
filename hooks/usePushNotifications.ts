import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotificationsAsync,
  sendTokenToBackend,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
} from '~/lib/push-notifications';
import { useFetch } from './useFetch';
import { Platform } from 'react-native';

export function usePushNotifications() {
  const { userId, isSignedIn } = useAuth();
  const $fetch = useFetch();
  const router = useRouter();
  const notificationListener = useRef<Notifications.EventSubscription>(null);
  const responseListener = useRef<Notifications.EventSubscription>(null);

  useEffect(() => {
    if (!isSignedIn || !userId) return;

    // Register for push notifications and send token to backend
    const setupPushNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          await sendTokenToBackend(token, $fetch);
        }
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    setupPushNotifications();

    // Handle notifications received while app is running
    notificationListener.current = addNotificationReceivedListener((notification) => {

      // Handle different types of notifications
      const data = notification.request.content.data;
      if (data?.type === 'recipe_processed') {
        // You can show a toast or update the UI
      }
    });

    // Handle notification responses (when user taps on notification)
    responseListener.current = addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === 'recipe_processed') {
        // Navigate to the recipe or recipes list
        if (data.recipeId) {
          router.push(`/recipes/${data.recipeId}`);
        } else {
          router.push('/(tabs)/profile/my-recipes');
        }
      }
    });

    // Check if the app was launched by a notification
    const checkInitialNotification = async () => {
      const response = await getLastNotificationResponseAsync();
      if (response) {
        const data = response.notification.request.content.data;
        if (data?.type === 'recipe_processed') {
          if (data.recipeId) {
            router.push(`/recipes/${data.recipeId}`);
          } else {
            router.push('/(tabs)/profile/my-recipes');
          }
        }
      }
    };

    if (Platform.OS === 'web') return;

    checkInitialNotification();

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [isSignedIn, userId, router, $fetch]);
}
