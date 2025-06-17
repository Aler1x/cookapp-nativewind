import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

export function useFetch() {
  const { getToken, isSignedIn } = useAuth();

  const $fetch = useCallback(
    async <T>(endpoint: string, options: RequestInit = {}, timeout = 30000): Promise<T> => {
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
        // Add timeout for mobile networks
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout); // 30 second timeout

        const response = await fetch(url, {
          ...fetchOptions,
          headers: {
            ...headers,
            ...fetchOptions.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return response.json() as Promise<T>;
        }

        if (contentType?.includes('image')) {
          return response.blob() as Promise<T>;
        }

        return response.text() as any;
      } catch (error) {
        console.error('Error fetching data', error);

        let errorMessage = 'An unknown error occurred';
        
        if (error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error.message || error.error) {
          errorMessage = error.message || error.error;
        }

        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: errorMessage,
        });

        throw error; // Re-throw so calling code can handle it
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getToken isn't a useCallback so we get on one call fucking 1 thousand calls
    [isSignedIn]
  );

  return $fetch;
}
