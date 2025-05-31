import { useAuth } from '@clerk/clerk-expo';
import { useState, useEffect, useCallback, useMemo } from 'react';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

// Pagination meta type matching user's requirements
export type PaginationMeta = {
  page: number;
  totalPages: number;
  totalItems: number;
};

// Generic paginated response type
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export function useFetch() {
  const { getToken, isSignedIn } = useAuth();

  const tokenMemo = useMemo(async () => {
    if (isSignedIn) {
      const token = await getToken();
      return token;
    }
    return null;
  }, [isSignedIn, getToken]);

  const $fetch = useCallback(async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const { ...fetchOptions } = options;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (isSignedIn) {
      const token = await tokenMemo;
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
  }, [isSignedIn]);

  return $fetch;
}

/**
 * Hook for pagination with automatic loading and state management
 */
export function usePagination<T>(
  endpoint: string,
  options: {
    initialPage?: number;
    pageSize?: number;
    autoLoad?: boolean;
    dependencies?: any[];
  } = {}
) {
  const { getToken, isSignedIn } = useAuth();
  const { initialPage = 1, pageSize = 10, autoLoad = true, dependencies = [] } = options;

  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: initialPage,
    totalPages: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const buildUrl = useCallback((page: number) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', pageSize.toString());
    return url.toString();
  }, [endpoint, pageSize]);

  const fetchPage = useCallback(async (page: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

      const response = await fetch(buildUrl(page), {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: PaginatedResponse<T> = await response.json();

      setData(prev => append ? [...prev, ...result.data] : result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [buildUrl, getToken, isSignedIn]);

  const loadMore = useCallback(() => {
    if (!loading && meta.page < meta.totalPages) {
      fetchPage(meta.page + 1, true);
    }
  }, [fetchPage, loading, meta.page, meta.totalPages]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setData([]);
    fetchPage(initialPage, false);
  }, [fetchPage, initialPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= meta.totalPages) {
      fetchPage(page, false);
    }
  }, [fetchPage, meta.totalPages]);

  // Auto-load on mount and dependency changes
  useEffect(() => {
    if (autoLoad) {
      fetchPage(initialPage, false);
    }
  }, [autoLoad, initialPage, ...dependencies]);

  return {
    data,
    meta,
    loading,
    error,
    refreshing,
    loadMore,
    refresh,
    goToPage,
    hasMore: meta.page < meta.totalPages,
    isEmpty: data.length === 0 && !loading,
  };
}
