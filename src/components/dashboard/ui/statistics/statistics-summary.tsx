import type {
  TaskStatus,
  TasksCalendarStatsResponse,
  TasksCountPerProjectItem,
} from "@/types/project";
import { formatStatusLabel } from "@/utils/helpers";

type StatisticsSummarySectionProps = {
  totals: TasksCalendarStatsResponse["totals"];
  totalTasks: number;
  projects: TasksCountPerProjectItem[];
  isProjectsLoading?: boolean;
};

const STATUS_CHART_COLORS: Record<TaskStatus, string> = {
  TO_DO: "#94A3A6",
  IN_PROGRESS: "#003D9B",
  BLOCKED: "#BA1A1A",
  IN_REVIEW: "#94A3B8",
  READY_FOR_QA: "#2F80ED",
  REOPENED: "#BA1A1A",
  READY_FOR_PRODUCTION: "#2563EB",
  DONE: "#004E32",
};

/* Build the CSS conic-gradient parts for the doughnut chart.
 Each status count is converted to a percentage of the total tasks.
 The function keeps track of where the previous slice ended,
 so the next slice starts from that point.
 Example:
 IN_PROGRESS = 12 of 24 => 50%  => color 0% to 50%
 DONE = 9 of 24         => 37.5% => color 50% to 50% + 37.5% >> 87.5%
 BLOCKED = 3 of 24      => 12.5% => color 87.5% to  87.5% + 12.5% >>  100%
 Final result:
 "#003D9B 0% 50%, #004E32 50% 87.5%, #BA1A1A 87.5% 100%"
*/
function buildDonutGradient(entries: [TaskStatus, number][], total: number) {
  // This pointer tracks where the current doughnut slice should start.
  // After each slice, we move it to the end of that slice.
  let currentPercentage = 0;

  return entries
    .map(([status, count]) => {
      const percentage = (count / total) * 100;
      const start = currentPercentage;
      const end = currentPercentage + percentage;

      currentPercentage = end;

      return `${STATUS_CHART_COLORS[status]} ${start}% ${end}%`;
    })
    .join(", ");
}

export function StatisticsSummary({
  totals,
  totalTasks,
  projects,
  isProjectsLoading = false,
}: StatisticsSummarySectionProps) {
  const statusEntries = Object.entries(totals).filter(([, count]) => Number(count) > 0) as [
    TaskStatus,
    number,
  ][];

  //   conic-gradient(red 0% 50%, green 50% 100%)
  const donutBackground =
    totalTasks > 0 ? `conic-gradient(${buildDonutGradient(statusEntries, totalTasks)})` : "#E8EEF8";

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-extrabold text-navy md:hidden">Task Statistics</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Tasks By Status */}
        <div className="rounded-xl bg-white p-6 md:min-h-62">
          <h3 className="text-base font-extrabold text-navy">Tasks by Status</h3>

          <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-center">
            {/* Doughnut Chart Section*/}
            <div
              className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full md:h-40 md:w-40 "
              style={{ background: donutBackground }}
            >
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white md:h-24 md:w-24">
                <p className="text-3xl font-extrabold leading-none text-navy">{totalTasks}</p>
                <p className="text-xs font-bold text-slate/60">Total</p>
              </div>
            </div>
            {/* Progress Section */}
            <div className="w-full space-y-3">
              {statusEntries.length ? (
                statusEntries.map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3 text-xs font-bold text-navy">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: STATUS_CHART_COLORS[status] }}
                    />

                    <span className="min-w-23">{formatStatusLabel(status)}</span>

                    <div className="h-1 flex-1 rounded-full bg-[#E8EEF8]">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          width: `${(count / totalTasks) * 100}%`,
                          backgroundColor: STATUS_CHART_COLORS[status],
                        }}
                      />
                    </div>

                    <span className="min-w-6 text-right">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate">No tasks found</p>
              )}
            </div>
          </div>
        </div>

        {/* All Projects */}
        <div className="rounded-xl bg-white p-6 md:min-h-62">
          <h3 className="text-base font-extrabold text-navy">All Projects</h3>

          <div className="mt-8 space-y-5">
            {isProjectsLoading && (
              <p className="text-sm font-semibold text-slate">Loading projects...</p>
            )}

            {!isProjectsLoading && !projects.length && (
              <p className="text-sm font-semibold text-slate">No projects found</p>
            )}

            {!isProjectsLoading &&
              projects.map((project) => (
                <div key={project.project_id} className="flex items-center justify-between gap-4">
                  <p className="text-xs font-bold text-slate">{project.project_name}</p>

                  <p className="shrink-0 text-xs font-extrabold text-navy">
                    {project.tasks_count} Tasks
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
