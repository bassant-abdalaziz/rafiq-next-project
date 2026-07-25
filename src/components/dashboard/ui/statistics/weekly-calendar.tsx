import { eachDayOfInterval, format, isToday, parseISO } from "date-fns";

import type { StatisticsDateRange, TaskStatus, TasksCalendarStatsResponse } from "@/types/project";
import { formatStatusLabel, STATUS_BADGE_COLORS } from "@/utils/helpers";
import NoTasksIcon from "@/assets/icons/no-tasks.svg";

type WeeklyCalendarProps = {
  dateRange: StatisticsDateRange;
  daily: TasksCalendarStatsResponse["daily"];
};

const EMPTY_MOBILE_BADGE_CLASS = "bg-[#DCEAFF] text-primary";

export function WeeklyCalendar({ dateRange, daily }: WeeklyCalendarProps) {
  // Get all days between start date and end date to shape card of each day
  const days = eachDayOfInterval({
    start: parseISO(dateRange.startDate),
    end: parseISO(dateRange.endDate),
  });

  const dailyMap = new Map(daily.map((dayItem) => [dayItem.day, dayItem.statuses]));

  return (
    <section className="mt-4">
      <h2 className="mb-4 text-lg font-extrabold text-navy md:hidden">Calendar</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-7 md:gap-4">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const statuses = dailyMap.get(dayKey) ?? {};

          const statusEntries = Object.entries(statuses).filter(
            ([, count]) => Number(count) > 0
          ) as [TaskStatus, number][];

          const hasTasks = statusEntries.length > 0;
          const isCurrentDay = isToday(day);

          return (
            <div
              key={dayKey}
              className={[
                "relative rounded-lg",
                "md:flex md:min-h-100 md:flex-col md:bg-white md:p-4",
                "bg-[#F0F4FF] px-4 py-3",
                isCurrentDay
                  ? "border border-primary shadow-sm md:border-2"
                  : "border border-transparent",
              ].join(" ")}
            >
              {isCurrentDay && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-1 text-[8px] font-extrabold uppercase text-white md:-top-3 md:left-1/2 md:right-auto md:top-auto md:-translate-x-1/2 md:translate-y-0 md:text-[9px]">
                  Today
                </div>
              )}

              {/* Mobile View */}
              <div className="flex items-center gap-6 md:hidden">
                <div className="w-10 shrink-0">
                  <p className="text-[10px] font-extrabold uppercase text-slate/60">
                    {format(day, "EEE")}
                  </p>

                  <p className="mt-1 text-lg font-extrabold leading-none text-navy">
                    {format(day, "d")}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pr-16">
                  {hasTasks ? (
                    statusEntries.map(([taskStatus, count]) => (
                      <span
                        key={taskStatus}
                        className={[
                          "flex h-5 min-w-5 items-center justify-center rounded-sm px-1.5 text-[10px] font-extrabold",
                          STATUS_BADGE_COLORS[taskStatus],
                        ].join(" ")}
                        title={formatStatusLabel(taskStatus)}
                      >
                        {count}
                      </span>
                    ))
                  ) : (
                    <span
                      className={[
                        "flex h-5 min-w-5 items-center justify-center rounded-sm px-1.5 text-[10px] font-extrabold",
                        EMPTY_MOBILE_BADGE_CLASS,
                      ].join(" ")}
                    >
                      0
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <div>
                  <p className="text-xs font-extrabold uppercase text-slate/60">
                    {format(day, "EEE")}
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-navy">{format(day, "d MMM")}</p>
                </div>

                {hasTasks ? (
                  <div className="mt-5 flex flex-col gap-3">
                    {statusEntries.map(([taskStatus, count]) => (
                      <div
                        key={taskStatus}
                        className={[
                          "flex min-h-9 items-center justify-between rounded-sm px-3 text-xs font-extrabold",
                          STATUS_BADGE_COLORS[taskStatus],
                        ].join(" ")}
                      >
                        <span>{formatStatusLabel(taskStatus)}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-70 flex-col items-center justify-center">
                    <NoTasksIcon className="text-slate/60" />

                    <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[1px] text-slate/60">
                      No Tasks
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
