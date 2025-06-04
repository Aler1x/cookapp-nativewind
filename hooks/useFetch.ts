import { useAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

export function useFetch() {
  const { getToken, isSignedIn } = useAuth();

  const $fetch = useCallback(async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
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

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      console.error('HTTP Error', response.status, response.statusText);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(response);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return response.text() as T;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getToken isn't a useCallback so we get on one call fucking 1 thousand calls
  }, [isSignedIn]);

  return $fetch;
}
