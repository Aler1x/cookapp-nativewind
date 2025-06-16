import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

export function useFetch() {
  const { getToken, isSignedIn } = useAuth();

  const $fetch = useCallback(
    async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      const { ...fetchOptions } = options;
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...headers,
            ...fetchOptions.headers,
          },
        });

        if (process.env.NODE_ENV === 'development') {
          console.group(`🌐 API Request: ${fetchOptions.method || 'GET'} ${endpoint}`);
          console.log('📍 URL:', url);
          console.log('📤 Request:', {
            method: fetchOptions.method || 'GET',
            body: fetchOptions.body ? JSON.parse(fetchOptions.body as string) : undefined,
          });
          console.log('📥 Response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
          });
          console.groupEnd();
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return response.json() as Promise<T>;
        }

        return response.text() as any;
      } catch (error) {
        console.error('Error fetching data', error);

        if (error instanceof Error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message,
          });
        }
        if (error.message || error.error) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message || error.error || 'An unknown error occurred',
          });
        }

        return null as any;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getToken isn't a useCallback so we get on one call fucking 1 thousand calls
    [isSignedIn]
  );

  return $fetch;
}
