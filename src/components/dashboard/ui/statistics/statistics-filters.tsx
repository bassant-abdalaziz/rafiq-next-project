"use client";

import { useState } from "react";
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { DayPicker, type DateRange } from "react-day-picker";

import { TASK_STATUS_OPTIONS } from "@/constants";
import { StatisticsDateRange, TaskStatus } from "@/types/project";

import PreviousIcon from "@/assets/icons/prev-date.svg";
import NextIcon from "@/assets/icons/next-date.svg";
import { ReactSelectField, type SelectOption } from "@/components/ui/react-select-field";



type ProjectOption = {
  id: string;
  name: string;
};

type StatisticsFiltersProps = {
  dateRange: StatisticsDateRange;
  projectId: string | null;
  status: TaskStatus | null;
  projects?: ProjectOption[];
  onDateRangeChange: (dateRange: StatisticsDateRange) => void;
  onProjectChange: (projectId: string | null) => void;
  onStatusChange: (status: TaskStatus | null) => void;
};

function formatDateForApi(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function formatDateRangeLabel(dateRange: StatisticsDateRange) {
  const startDate = parseISO(dateRange.startDate);
  const endDate = parseISO(dateRange.endDate);

  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
}

function formatStatusLabel(status: TaskStatus) {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

function getDraftRangeFromDateRange(dateRange: StatisticsDateRange): DateRange {
  return {
    from: parseISO(dateRange.startDate),
    to: parseISO(dateRange.endDate),
  };
}

export function StatisticsFilters({
  dateRange,
  projectId,
  status,
  projects = [],
  onDateRangeChange,
  onProjectChange,
  onStatusChange,
}: StatisticsFiltersProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateError, setDateError] = useState("");
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(() =>
    getDraftRangeFromDateRange(dateRange)
  );

  const handleOpenCalendar = () => {
    setDateError("");
    setDraftRange(getDraftRangeFromDateRange(dateRange));
    setIsCalendarOpen((currentValue) => !currentValue);
  };

  const handlePreviousWeek = () => {
    const startDate = addDays(parseISO(dateRange.startDate), -7);
    const endDate = addDays(parseISO(dateRange.endDate), -7);

    const nextDateRange = {
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
    };

    setDateError("");
    setDraftRange(getDraftRangeFromDateRange(nextDateRange));
    onDateRangeChange(nextDateRange);
  };

  const handleNextWeek = () => {
    const startDate = addDays(parseISO(dateRange.startDate), 7);
    const endDate = addDays(parseISO(dateRange.endDate), 7);

    const nextDateRange = {
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
    };

    setDateError("");
    setDraftRange(getDraftRangeFromDateRange(nextDateRange));
    onDateRangeChange(nextDateRange);
  };

  const handleCancelRange = () => {
    setDateError("");
    setDraftRange(getDraftRangeFromDateRange(dateRange));
    setIsCalendarOpen(false);
  };

  const handleApplyRange = () => {
    if (!draftRange?.from || !draftRange?.to) {
      setDateError("Please select start and end date");
      return;
    }

    const selectedDaysCount = differenceInCalendarDays(draftRange.to, draftRange.from) + 1;

    if (selectedDaysCount > 7) {
      setDateError("Date range cannot exceed 7 days");
      return;
    }

    const nextDateRange = {
      startDate: formatDateForApi(draftRange.from),
      endDate: formatDateForApi(draftRange.to),
    };

    setDateError("");
    onDateRangeChange(nextDateRange);
    setIsCalendarOpen(false);
  };

  const projectOptions: SelectOption[] = [
    { value: "all", label: "All Projects" },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ];

  const statusOptions: SelectOption[] = [
    { value: "all", label: "All Statuses" },
    ...TASK_STATUS_OPTIONS.map((statusOption) => ({
      value: statusOption,
      label: formatStatusLabel(statusOption),
    })),
  ];

  return (
    <div className="relative mt-8 rounded-lg bg-surface-low px-4 py-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Date Range */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous week"
              onClick={handlePreviousWeek}
              className="flex h-8 w-8 items-center justify-center rounded-md text-navy hover:bg-white"
            >
              <PreviousIcon />
            </button>

            <button
              type="button"
              onClick={handleOpenCalendar}
              className="min-w-20 text-left text-sm font-bold text-navy"
            >
              {formatDateRangeLabel(dateRange)}
            </button>

            <button
              type="button"
              aria-label="Next week"
              onClick={handleNextWeek}
              className="flex h-8 w-8 items-center justify-center rounded-md text-navy hover:bg-white"
            >
              <NextIcon />
            </button>
          </div>

          {isCalendarOpen && (
            <div className="absolute left-0 top-12 z-30 w-[310px] rounded-md bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
              <DayPicker
                mode="range"
                selected={draftRange}
                onSelect={(range) => {
                  setDateError("");
                  setDraftRange(range);
                }}
                weekStartsOn={0}
                classNames={{
                  root: "w-full",
                  month_caption: "mb-3 flex items-center justify-between",
                  caption_label: "text-sm font-bold text-navy",
                  nav: "absolute right-4 top-4 flex items-center gap-2",
                  button_previous:
                    "flex h-6 w-6 items-center justify-center rounded-md text-navy hover:bg-surface-low",
                  button_next:
                    "flex h-6 w-6 items-center justify-center rounded-md text-navy hover:bg-surface-low",
                  month_grid: "w-full border-collapse",
                  weekdays: "grid grid-cols-7",
                  weekday: "pb-2 text-center text-[9px] font-bold uppercase text-slate",
                  week: "grid grid-cols-7",
                  day: "flex h-8 items-center justify-center text-xs",
                  day_button:
                    "flex h-7 w-7 items-center justify-center rounded-md text-xs text-navy hover:bg-light-navy",
                  selected: "[&>button]:bg-[#D9E8FF] [&>button]:font-bold [&>button]:text-primary",
                  range_start:
                    "[&>button]:bg-[#D9E8FF] [&>button]:font-bold [&>button]:text-primary",
                  range_end: "[&>button]:bg-[#D9E8FF] [&>button]:font-bold [&>button]:text-primary",
                  range_middle:
                    "[&>button]:bg-[#EAF2FF] [&>button]:font-bold [&>button]:text-primary",
                  today: "[&>button]:border [&>button]:border-primary [&>button]:font-bold",
                  outside: "text-slate/30",
                }}
              />

              {dateError && <p className="mt-3 text-xs font-semibold text-error">{dateError}</p>}

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCancelRange}
                  className="h-9 px-4 text-xs font-medium text-slate"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleApplyRange}
                  className="h-9 rounded-sm bg-primary px-5 text-xs font-bold text-white"
                >
                  Apply Range
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* All Projects */}
          <div className="min-w-55">
            <ReactSelectField
              id="project-filter"
              placeholder="All Projects"
              value={projectId ?? "all"}
              options={projectOptions}
              isClearable={false}
              isSearchable={false}
              onChange={(value) => {
                onProjectChange(value === "all" ? null : value);
              }}
            />
          </div>

          {/* All Status */}
          <div className="min-w-55">
            <ReactSelectField
              id="status-filter"
              placeholder="All Statuses"
              value={status ?? "all"}
              options={statusOptions}
              isClearable={false}
              isSearchable={false}
              onChange={(value) => {
                onStatusChange(value === "all" ? null : (value as TaskStatus));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
