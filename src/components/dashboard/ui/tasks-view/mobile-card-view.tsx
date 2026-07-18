"use client";

import { TaskPayload, TasksArgs } from "@/types/project";
import {
  formatProjectDate,
  formatStatusLabel,
  getAvatarColorClasses,
  getAvatarInitials,
  STATUS_BADGE_COLORS,
} from "@/utils/helpers";

function formatTaskDueDate(value?: string | null) {
  if (!value) return "No due date";

  return formatProjectDate(value);
}

function MobileDotsButton() {
  return (
    <button
      type="button"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      aria-label="Task actions"
    >
      <span className="flex flex-col gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-slate/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-slate/50" />
      </span>
    </button>
  );
}

function TaskCard({
  task,
  onTaskClick,
}: {
  task: TaskPayload;
  onTaskClick?: (taskId: string) => void;
}) {
  const assigneeName = task.assignee?.name ?? "Unassigned";

  return (
    <div
      onClick={() => onTaskClick?.(task.id)}
      className="cursor-pointer rounded-2xl bg-white p-6 shadow-sm "
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-bold uppercase text-slate-darker/80">{task.task_id}</p>

        <span
          className={`
            shrink-0 rounded-md px-4 py-2 text-xs font-extrabold uppercase
            ${STATUS_BADGE_COLORS[task.status]}`}
        >
          {formatStatusLabel(task.status)}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-medium leading-8 text-navy">{task.title}</h3>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={`
              flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
              ${getAvatarColorClasses(assigneeName)}
            `}
          >
            {getAvatarInitials(assigneeName)}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase text-slate/70">Due Date</p>

            <p className="mt-1 text-xs font-medium text-navy">{formatTaskDueDate(task.due_date)}</p>
          </div>
        </div>

        <MobileDotsButton />
      </div>
    </div>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="h-5 w-24 animate-pulse rounded bg-slate-lighter" />
        <div className="h-9 w-24 animate-pulse rounded-md bg-slate-lighter" />
      </div>

      <div className="mt-4 space-y-3">
        <div className="h-8 w-full animate-pulse rounded bg-slate-lighter" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-slate-lighter" />
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 animate-pulse rounded-full bg-slate-lighter" />

          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-lighter" />
            <div className="mt-2 h-5 w-28 animate-pulse rounded bg-slate-lighter" />
          </div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center">
          <div className="flex flex-col gap-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-lighter" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-lighter" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-lighter" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileView({ tasks, loading, error, onTaskClick }: TasksArgs) {
  return !loading && tasks.length === 0 ? (
    <div className="p-8 text-center text-sm font-semibold text-slate">No tasks found</div>
  ) : (
    <div className="mt-6 w-full">
      {/* Handle Loading */}
      {loading && (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Handle Error */}
      {!loading && error && (
        <div className="rounded-lg border border-[#E4E8F1] bg-white p-5 text-center text-sm font-semibold text-error">
          Failed to load tasks
        </div>
      )}

      {/* Display Card Of Task  */}
      {!loading && !error && (
        <div className="space-y-5">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
        </div>
      )}
    </div>
  );
}
