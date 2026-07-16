import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage, getOffset } from "@/utils/helpers";

type PaginatedFetcherArgs = {
  limit: number;
  offset: number;
};

type PaginatedFetcherResult<TItem> = {
  items: TItem[];
  totalCount: number;
};

type UsePaginatedFetchArgs<TItem> = {
  limit: number;
  page: number;
  fetcher: (args: PaginatedFetcherArgs) => Promise<PaginatedFetcherResult<TItem>>;
};

export function usePaginatedFetch<TItem>({ limit, page, fetcher }: UsePaginatedFetchArgs<TItem>) {
  const [items, setItems] = useState<TItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const requestIdRef = useRef(0);
  const isFetchingMoreRef = useRef(false);

  const currentOffset = getOffset(page, limit);
  const loadedUntil = currentOffset + items.length;
  const hasMore = loadedUntil < totalCount;

  // Fetch new data and replace old data
  const fetchPage = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setIsLoading(true);
    setError(null);
    setLoadMoreError(null);

    try {
      const response = await fetcher({
        limit,
        offset: getOffset(page, limit),
      });

      if (requestIdRef.current !== requestId) return;

      setItems(response.items);
      setTotalCount(response.totalCount);
      setHasFetched(true);
    } catch (error) {
      if (requestIdRef.current !== requestId) return;

      setItems([]);
      setTotalCount(0);
      setError(getErrorMessage(error));
      setHasFetched(true);
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, [fetcher, limit, page]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchPage();
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [fetchPage]);

  // Fetch new data and append it on old data
  const fetchMore = useCallback(async () => {
    if (!hasMore) return;
    if (isLoading || isLoadingMore) return;
    if (error || loadMoreError) return;
    if (isFetchingMoreRef.current) return;

    isFetchingMoreRef.current = true;
    setIsLoadingMore(true);
    setLoadMoreError(null);

    try {
      const response = await fetcher({
        limit,
        offset: loadedUntil,
      });

      setItems((currentItems) => [...currentItems, ...response.items]);
      setTotalCount(response.totalCount);
    } catch (error) {
      setLoadMoreError(getErrorMessage(error));
    } finally {
      setIsLoadingMore(false);
      isFetchingMoreRef.current = false;
    }
  }, [hasMore, isLoading, isLoadingMore, error, loadMoreError, fetcher, limit, loadedUntil]);

  // Update one item inside the local list
  const updateItem = useCallback(
    (predicate: (item: TItem) => boolean, updater: (item: TItem) => TItem) => {
      setItems((currentItems) =>
        currentItems.map((item) => (predicate(item) ? updater(item) : item))
      );
    },
    []
  );

  return {
    items,
    totalCount,
    isLoading,
    isLoadingMore,
    error,
    loadMoreError,
    hasFetched,
    hasMore,
    fetchMore,
    updateItem,
    retry: fetchPage,
  };
}