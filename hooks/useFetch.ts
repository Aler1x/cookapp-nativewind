import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { ErrorResponse } from '~/types';

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
        if (error satisfies ErrorResponse) {
          if (error.message || error.error) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: error.message || error.error || 'An unknown error occurred',
            });
          }
        }

        return null as any;
      } finally {
        if (process.env.NODE_ENV === 'development') {
          // console.log(response);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getToken isn't a useCallback so we get on one call fucking 1 thousand calls
    [isSignedIn]
  );

  return $fetch;
}
