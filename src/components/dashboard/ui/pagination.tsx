"use client";

import { Button } from "@/components/ui/button";

type ProjectsPaginationProps = {
  total: number;
  visibleCount: number;
  page: number;
  limit: number;
  handlePage: (page: number) => void;
};

export function Pagination({
  total,
  visibleCount,
  page,
  limit,
  handlePage,
}: ProjectsPaginationProps) {
  const totalPages = Math.ceil(total / limit);

  // to disable previous btn if user in first page
  const isFirstPage = page === 1;
  //to disable next btn if user in last page
  const isLastPage = page === totalPages;

  const endItem = (page - 1) * limit + visibleCount;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-28 hidden items-center justify-between md:flex">
      <p className="text-sm text-slate">
        Showing {endItem} of {total} active projects
      </p>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          disabled={isFirstPage}
          onClick={() => handlePage(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E4E8F1] p-0 text-slate"
        >
          ‹
        </Button>

        {pages.map((pageNumber) => {
          const isActive = pageNumber === page;

          return (
            <Button
              key={pageNumber}
              type="button"
              variant={isActive ? "primary" : "ghost"}
              onClick={() => handlePage(pageNumber)}
              className={
                isActive
                  ? "flex h-8 w-8 items-center justify-center rounded-sm p-0"
                  : "flex h-8 w-8 items-center justify-center rounded-sm border border-[#E4E8F1] p-0 text-slate"
              }
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          disabled={isLastPage}
          onClick={() => handlePage(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E4E8F1] p-0 text-slate"
        >
          ›
        </Button>
      </div>
    </div>
  );
}
