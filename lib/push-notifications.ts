import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useFetch } from '~/hooks/useFetch';
import { API_ENDPOINTS_PREFIX } from './constants';

// Configure how notifications should be handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationToken {
  token: string;
  type: 'expo' | 'fcm' | 'apns';
}

/**
 * Request permissions and get push notification token
 */
export async function registerForPushNotificationsAsync(): Promise<PushNotificationToken | null> {
  let token: string | undefined;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return null;
    }

    try {
      const projectId = process.env.EXPO_PUBLIC_PROJECT_ID || 'ed3520ad-df52-44b4-8ad5-fa6d30256b15';
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Expo push token:', token);
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  } else {
    alert('Must use physical device for Push Notifications');
    return null;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return {
    token,
    type: 'expo',
  };
}

/**
 * Send push notification token to backend
 */
export async function sendTokenToBackend(
  token: PushNotificationToken,
  $fetch: ReturnType<typeof useFetch>
): Promise<boolean> {
  try {
    await $fetch(`${API_ENDPOINTS_PREFIX.spring}/users/push-token`, {
      method: 'PUT',
      body: JSON.stringify({
        token: token.token,
        type: token.type,
        platform: Platform.OS,
      }),
    });

    return true;
  } catch (error) {
    console.error('Error sending token to backend:', error);
    return false;
  }
}

/**
 * Handle notification received while app is running
 */
export function addNotificationReceivedListener(handler: (notification: Notifications.Notification) => void) {
  return Notifications.addNotificationReceivedListener(handler);
}

/**
 * Handle notification response (when user taps on notification)
 */
export function addNotificationResponseReceivedListener(
  handler: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(handler);
}

/**
 * Get last notification response (useful for handling notifications that launched the app)
 */
export async function getLastNotificationResponseAsync() {
  return await Notifications.getLastNotificationResponseAsync();
}
