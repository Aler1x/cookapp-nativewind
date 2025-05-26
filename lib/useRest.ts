import { useState } from 'react';

/**
 * Type definitions for REST operations
 */
export type RestResponse<T = any> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export type RestOptions = {
  headers?: Record<string, string>;
  baseUrl?: string;
};

/**
 * Custom hook for performing REST operations
 * @param endpoint API endpoint
 * @param options Additional options for REST operations
 * @returns Object with methods for REST operations and loading/error state
 */
export function useRest(endpoint: string, options: RestOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = options.baseUrl || process.env.EXPO_PUBLIC_API_ENDPOINT || '';
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  /**
   * Helper function to handle API requests
   */
  const handleRequest = async <T>(method: string, path: string = '', data?: any): Promise<RestResponse<T>> => {
    setIsLoading(true);
    setError(null);

    try {
      const requestOptions: RequestInit = {
        method,
        headers: defaultHeaders,
      };

      if (data && method !== 'GET' && method !== 'HEAD') {
        requestOptions.body = JSON.stringify(data);
      }

      const requestUrl = path ? `${url}/${path}` : url;
      const response = await fetch(requestUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      return { data: responseData, error: null, isLoading: false };
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      return { data: null, error: errorObj, isLoading: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Get all resources
    get: async <T>(): Promise<RestResponse<T>> => {
      return handleRequest<T>('GET');
    },

    // Get a single resource by ID
    getById: async <T>(id: string): Promise<RestResponse<T>> => {
      return handleRequest<T>('GET', id);
    },

    // Create a new resource
    post: async <T>(data: any): Promise<RestResponse<T>> => {
      return handleRequest<T>('POST', '', data);
    },

    // Update a resource with ID
    put: async <T>(id: string, data: any): Promise<RestResponse<T>> => {
      return handleRequest<T>('PUT', id, data);
    },

    // Partially update a resource
    patch: async <T>(id: string, data: any): Promise<RestResponse<T>> => {
      return handleRequest<T>('PATCH', id, data);
    },

    // Delete a resource
    delete: async <T>(id: string): Promise<RestResponse<T>> => {
      return handleRequest<T>('DELETE', id);
    },

    // Current state
    isLoading,
    error,
  };
}
