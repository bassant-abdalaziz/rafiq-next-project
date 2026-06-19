export function ProjectMembersSkeleton() {
  return (
    <div className="w-full space-y-8">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-lighter" />
            <div className="h-3 w-2 animate-pulse rounded bg-slate-lighter" />
            <div className="h-3 w-24 animate-pulse rounded bg-slate-lighter" />
            <div className="h-3 w-2 animate-pulse rounded bg-slate-lighter" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-lighter" />
          </div>

          <div className="mt-5 h-8 w-56 animate-pulse rounded bg-slate-lighter" />
        </div>

        <div className="h-11 w-36 animate-pulse rounded bg-slate-lighter" />
      </div>

      <div className="hidden rounded-sm bg-white shadow-sm md:block">
        <div className="grid grid-cols-[1.6fr_0.8fr_0.4fr] border-b border-[#EEF1F7] px-8 py-5">
          <div className="h-3 w-20 animate-pulse rounded bg-slate-lighter" />
          <div className="h-3 w-12 animate-pulse rounded bg-slate-lighter" />
          <div className="h-3 w-16 animate-pulse rounded bg-slate-lighter" />
        </div>

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.6fr_0.8fr_0.4fr] items-center border-b border-[#EEF1F7] px-8 py-5 last:border-b-0"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-lighter" />

              <div>
                <div className="h-4 w-32 animate-pulse rounded bg-slate-lighter" />
                <div className="mt-2 h-3 w-44 animate-pulse rounded bg-slate-lighter" />
              </div>
            </div>

            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-lighter" />

            <div className="ml-auto h-5 w-5 animate-pulse rounded bg-slate-lighter" />
          </div>
        ))}
      </div>

      <div className="space-y-3 md:hidden">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-lighter" />

        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between rounded-sm bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 animate-pulse rounded-lg bg-slate-lighter" />

              <div>
                <div className="h-4 w-28 animate-pulse rounded bg-slate-lighter" />
                <div className="mt-2 h-3 w-36 animate-pulse rounded bg-slate-lighter" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-6 w-14 animate-pulse rounded bg-slate-lighter" />
              <div className="h-5 w-2 animate-pulse rounded bg-slate-lighter" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}