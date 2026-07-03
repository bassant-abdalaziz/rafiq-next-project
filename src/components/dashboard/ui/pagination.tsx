"use client";

import Link from "next/link";

type ProjectsPaginationProps = {
  total: number;
  visibleCount: number;
  page: number;
  limit: number;
  pathname: string;
  searchParamsString?: string;
};

type PageItem = number | "...";

function getPaginationItems(currentPage: number, totalPages: number): PageItem[] {
  const siblingCount = 1;

  const pagesSet = new Set<number>();

  pagesSet.add(1);

  for (let i = currentPage - siblingCount; i <= currentPage + siblingCount; i++) {
    if (i >= 1 && i <= totalPages) {
      pagesSet.add(i);
    }
  }

  pagesSet.add(totalPages);

  const pages = Array.from(pagesSet).sort((a, b) => a - b);

  const result: PageItem[] = [];

  for (let i = 0; i < pages.length; i++) {
    const current = pages[i];
    const previous = pages[i - 1];

    if (i === 0) {
      result.push(current);
      continue;
    }

    const gap = current - previous;

    if (gap === 1) {
      result.push(current);
    } else if (gap === 2) {
      result.push(previous + 1);
      result.push(current);
    } else {
      result.push("...");
      result.push(current);
    }
  }

  return result;
}

function createPageHref(
  pathname: string,
  searchParamsString: string | undefined,
  page: number
) {
  const params = new URLSearchParams(searchParamsString);

  params.set("page", String(page));

  return `${pathname}?${params.toString()}`;
}

export function Pagination({
  total,
  visibleCount,
  page,
  limit,
  pathname,
  searchParamsString,
}: ProjectsPaginationProps) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const isFirstPage = safePage <= 1;
  const isLastPage = safePage >= totalPages;

  const startItem = (safePage - 1) * limit + 1;
  const endItem = Math.min(startItem + visibleCount - 1, total);

  const pages = getPaginationItems(safePage, totalPages);

  const baseClass =
    "flex h-8 w-8 items-center justify-center rounded-sm border border-[#E4E8F1] p-0 text-slate transition hover:bg-[#F5F7FB]";

  const activeClass =
    "flex h-8 w-8 items-center justify-center rounded-sm bg-primary p-0 text-white";

  const disabledClass =
    "flex h-8 w-8 items-center justify-center rounded-sm border border-[#E4E8F1] p-0 text-slate opacity-50 cursor-not-allowed";

  return (
    <div className="mt-28 hidden items-center justify-between md:flex">
      <p className="text-sm text-slate">
        Showing {startItem}-{endItem} of {total} active projects
      </p>

      <nav aria-label="Projects pagination" className="flex items-center gap-2">
        {isFirstPage ? (
          <span className={disabledClass} aria-disabled="true">
            ‹
          </span>
        ) : (
          <Link
            href={createPageHref(pathname, searchParamsString, safePage - 1)}
            scroll
            aria-label="Previous page"
            className={baseClass}
          >
            ‹
          </Link>
        )}

        {pages.map((pageItem, index) => {
          if (pageItem === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex h-8 w-8 items-center justify-center text-sm text-slate"
              >
                ...
              </span>
            );
          }

          const isActive = pageItem === safePage;

          return (
            <Link
              key={pageItem}
              href={createPageHref(pathname, searchParamsString, pageItem)}
              scroll
              aria-current={isActive ? "page" : undefined}
              className={isActive ? activeClass : baseClass}
            >
              {pageItem}
            </Link>
          );
        })}

        {isLastPage ? (
          <span className={disabledClass} aria-disabled="true">
            ›
          </span>
        ) : (
          <Link
            href={createPageHref(pathname, searchParamsString, safePage + 1)}
            scroll
            aria-label="Next page"
            className={baseClass}
          >
            ›
          </Link>
        )}
      </nav>
    </div>
  );
}