import React, { useState, useCallback } from 'react';
import { PaginatedResponse } from '~/types';
import { throttle } from 'lodash';

export function usePaginated<T>(fetcher: (page: number) => Promise<PaginatedResponse<T>>) {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // keeps track of the latest request so that older responses are ignored
  const latestRequestIdRef = React.useRef(0);

  const fetchPage = useCallback(
    throttle(async (page: number = 1, append: boolean = false) => {
      const requestId = ++latestRequestIdRef.current;

      try {
        if (!append) setIsLoading(true);
        else setIsLoadingMore(true);

        const response = await fetcher(page);

        // Only update state if this response is from the latest request
        if (requestId !== latestRequestIdRef.current) return;

        if (append) {
          setData((prev) => [...prev, ...response.data]);
        } else {
          setData(response.data);
        }

        setCurrentPage(response.meta.page);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        console.error('Error fetching paginated data:', error);
        if (!append) setData([]);
      } finally {
        if (requestId === latestRequestIdRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    }, 500),
    [fetcher]
  );

  const refresh = useCallback(() => fetchPage(1, false), [fetchPage]);
  const loadMore = useCallback(() => {
    if (isLoadingMore || currentPage >= totalPages) return;
    fetchPage(currentPage + 1, true);
  }, [fetchPage, isLoadingMore, currentPage, totalPages]);

  return {
    data,
    currentPage,
    totalPages,
    isLoading,
    isLoadingMore,
    fetchPage,
    refresh,
    loadMore,
  };
}
