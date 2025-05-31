import { useAuth } from '@clerk/clerk-expo';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

/**
 * Enhanced fetch that automatically adds necessary headers
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  return fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
}

/**
 * Hook for authenticated API requests with basic REST methods
 */
export function useApiFetch() {
  const { getToken, isSignedIn } = useAuth();

  const authenticatedFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if user is signed in
    if (isSignedIn) {
      try {
        const token = await getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return response.text();
  };

  return {
    // Basic REST methods
    get: (endpoint: string) => authenticatedFetch(endpoint, { method: 'GET' }),

    post: (endpoint: string, data?: any) =>
      authenticatedFetch(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),

    put: (endpoint: string, data?: any) =>
      authenticatedFetch(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),

    patch: (endpoint: string, data?: any) =>
      authenticatedFetch(endpoint, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      }),

    delete: (endpoint: string) => authenticatedFetch(endpoint, { method: 'DELETE' }),

    // Custom fetch with full control
    fetch: authenticatedFetch,
  };
}
