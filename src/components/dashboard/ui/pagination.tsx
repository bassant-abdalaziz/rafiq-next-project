type ProjectsPaginationProps = {
  total: number;
  visibleCount: number;
};

export function Pagination({
  total,
  visibleCount,
}: ProjectsPaginationProps) {
  return (
    <div className="mt-28 hidden items-center justify-between md:flex">
      <p className="text-sm text-slate">
        Showing {visibleCount} of {total} active projects
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E4E8F1] text-slate"
        >
          ‹
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-white"
        >
          1
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E4E8F1] text-slate"
        >
          2
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#E4E8F1] text-slate"
        >
          ›
        </button>
      </div>
    </div>
  );
}