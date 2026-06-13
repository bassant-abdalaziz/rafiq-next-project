export function ProjectsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="h-8 w-36 animate-pulse rounded color-slate-lighter" />
          <div className="mt-3 h-4 w-52 animate-pulse rounded color-slate-lighter" />
        </div>

        <div className="hidden h-11 w-44 animate-pulse rounded color-slate-lighter md:block" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-sm bg-white p-6 shadow-sm">
            <div className="h-28 animate-pulse rounded color-slate-lighter" />

            <div className="mt-5 h-4 w-3/4 animate-pulse rounded color-slate-lighter" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded color-slate-lighter" />

            <div className="mt-8 h-4 w-32 animate-pulse rounded color-slate-lighter" />
          </div>
        ))}
      </div>
    </div>
  );
}