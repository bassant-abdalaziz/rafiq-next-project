export function ProjectEpicsSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <div>
          <div className="mb-4 h-3 w-56 rounded bg-slate-lighter" />
          <div className="h-8 w-56 rounded bg-slate-lighter" />
        </div>

        <div className="flex gap-6">
          <div className="h-11 w-72 rounded bg-slate-lighter" />
          <div className="h-11 w-36 rounded bg-slate-lighter" />
        </div>
      </div>

      <div className="mb-5 h-11 rounded-lg bg-[#DFE8FF] md:hidden" />

      <div className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-sm bg-white p-5 shadow-sm">
            <div className="mb-5 flex justify-between">
              <div className="h-5 w-20 rounded bg-slate-lighter" />
              <div className="h-5 w-5 rounded-full bg-slate-lighter" />
            </div>

            <div className="mb-5 h-6 w-4/5 rounded bg-slate-lighter" />

            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-lighter" />
              <div>
                <div className="mb-2 h-3 w-20 rounded bg-slate-lighter" />
                <div className="h-4 w-28 rounded bg-slate-lighter" />
              </div>
            </div>

            <div className="hidden border-t border-[#EEF1F7] pt-4 md:flex md:justify-between">
              <div className="h-3 w-36 rounded bg-slate-lighter" />
              <div className="h-3 w-24 rounded bg-slate-lighter" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}