"use client";

import { useEffect, useRef } from "react";
import { LoadingDots } from "@/components/dashboard/ui/loading-dots";

type InfiniteScrollTriggerProps = {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  showOnlyOnMobile?: boolean;
};

export function InfiniteScrollTrigger({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  rootMargin = "200px",
  showOnlyOnMobile = true,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // Apply infinite scroll by using IntersectionObserver.
  useEffect(() => {
    const element = triggerRef.current;

    if (!element) return;
    if (!canLoadMore) return;
    if (isLoadingMore) return;

    if (showOnlyOnMobile) {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      if (!isMobile) return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [canLoadMore, isLoadingMore, rootMargin, showOnlyOnMobile]);

  return (
    <>
      <div ref={triggerRef} className="h-10 md:hidden" />

      {isLoadingMore && <LoadingDots label="loading more items" className="mt-4 md:hidden" />}
    </>
  );
}
