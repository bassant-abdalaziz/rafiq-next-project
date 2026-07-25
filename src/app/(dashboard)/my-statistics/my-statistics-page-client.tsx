"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SectionHeader } from "@/components/dashboard/ui/section-header";
import {
  StatisticsFilters,
  type StatisticsDateRange,
} from "@/components/dashboard/ui/statistics/statistics-filters";
import { getErrorMessage } from "@/utils/helpers";
import { getTasksCalendarStats } from "@/actions/project";
import type { TaskStatus, TasksCalendarStatsResponse } from "@/types/project";

import TotalTasksIcon from "@/assets/icons/total-tasks.svg";
import CompletedTasksIcon from "@/assets/icons/completed-tasks.svg";
import OverDueTasksIcon from "@/assets/icons/overdue-tasks.svg";
import { TaskCard } from "@/components/dashboard/ui/statistics/task-card";
import { LoadingDots } from "@/components/dashboard/ui/loading-dots";

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Get the current egyptian week range from Sunday to Saturday and format it as YYYY-MM-DD for the API.
function getCurrentWeekDateRange() {
  const today = new Date();
  const currentDay = today.getDay();

  /* {
    Sunday    = 0
    Monday    = 1
    Tuesday   = 2
    Wednesday = 3
    Thursday  = 4
    Friday    = 5
    Saturday  = 6
  } */

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - currentDay);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return {
    startDate: formatDateForApi(startDate),
    endDate: formatDateForApi(endDate),
  };
}

export default function MyStatisticsPageClient() {
  const [dateRange, setDateRange] = useState<StatisticsDateRange>(getCurrentWeekDateRange);

  const [projectId, setProjectId] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus | null>(null);

  const [stats, setStats] = useState<TasksCalendarStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const data = await getTasksCalendarStats({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          projectId,
          status,
        });

        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>data", data);

        setStats(data);
      } catch (error) {
        const message = getErrorMessage(error);

        setIsError(true);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadStatistics();
  }, [dateRange.startDate, dateRange.endDate, projectId, status]);

  return (
    <div className="w-full">
      <SectionHeader
        title="Weekly Planner"
        description="Manage your deadlines and track team velocity."
      />

      {/* Filter  Section */}
      <StatisticsFilters
        dateRange={dateRange}
        projectId={projectId}
        status={status}
        projects={[]}
        onDateRangeChange={setDateRange}
        onProjectChange={setProjectId}
        onStatusChange={setStatus}
      />

      <div>
        {isLoading && (
          <div className="mt-8">
            <LoadingDots />
          </div>
        )}

        {isError && <p className="text-sm font-semibold text-error">Failed to load statistics.</p>}

        {!isLoading && !isError && stats && (
          // Tasks Cards Section
          <div className="mt-8 flex flex-col gap-4 md:flex-row">
            <TaskCard title="TOTAL TASKS" icon={<TotalTasksIcon />} value={stats.total_tasks} />
            <TaskCard
              title="COMPLETED TASKS"
              icon={<CompletedTasksIcon />}
              value={stats.done_tasks}
            />
            <TaskCard
              title="OVERDUE TASKS"
              icon={<OverDueTasksIcon />}
              value={stats.overdue_tasks}
            />
          </div>
        )}
      </div>
    </div>
  );
}
