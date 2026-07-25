import { eachDayOfInterval, format, isToday, parseISO } from "date-fns";

import type { StatisticsDateRange, TaskStatus, TasksCalendarStatsResponse } from "@/types/project";
import { formatStatusLabel, STATUS_BADGE_COLORS } from "@/utils/helpers";
import NoTasksIcon from "@/assets/icons/no-tasks.svg";

type WeeklyCalendarProps = {
  dateRange: StatisticsDateRange;
  daily: TasksCalendarStatsResponse["daily"];
};

export function WeeklyCalendar({ dateRange, daily }: WeeklyCalendarProps) {
  //Get all days between start date and end date to shape card of each day
  const days = eachDayOfInterval({
    start: parseISO(dateRange.startDate),
    end: parseISO(dateRange.endDate),
  });

  const dailyMap = new Map(daily.map((dayItem) => [dayItem.day, dayItem.statuses]));

  return (
    <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-7">
      {days.map((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        const statuses = dailyMap.get(dayKey) ?? {};

        const statusEntries = Object.entries(statuses).filter(([, count]) => Number(count) > 0) as [
          TaskStatus,
          number,
        ][];

        const hasTasks = statusEntries.length > 0;
        const isCurrentDay = isToday(day);

        return (
          <div
            key={dayKey}
            className={[
              "relative flex min-h-100 flex-col rounded-lg bg-white p-4",
              isCurrentDay ? "border-2 border-primary" : "border border-transparent",
            ].join(" ")}
          >
            {isCurrentDay && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[9px] font-extrabold uppercase text-white">
                Today
              </div>
            )}

            <div>
              <p className="text-xs font-extrabold uppercase text-slate/60">{format(day, "EEE")}</p>

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
              <div className="flex flex-1 flex-col items-center justify-center">
                <NoTasksIcon className="text-slate/60" />
                <p className="mt-2 text-[10px] font-extrabold uppercase tracking-[1px] text-slate/60">
                  No Tasks
                </p>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
