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

function ListDotsButton() {
  return (
    <button
      type="button"
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      aria-label="Task actions"
    >
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-navy" />
        <span className="h-1.5 w-1.5 rounded-full bg-navy" />
        <span className="h-1.5 w-1.5 rounded-full bg-navy" />
      </span>
    </button>
  );
}

function TaskRow({
  task,
  onTaskClick,
}: {
  task: TaskPayload;
  onTaskClick?: (taskId: string) => void;
}) {
  const assigneeName = task.assignee?.name ?? "Unassigned";

  return (
    <tr
      onClick={() => onTaskClick?.(task.id)}
      className="cursor-pointer border-b border-[#EEF2F7] bg-white "
    >
      <td className="px-6 py-7 align-middle">
        <span className="text-[12px] font-normal text-primary">{task.task_id}</span>
      </td>

      <td className="px-6 py-7 align-middle">
        <p className="max-w-105 text-[14px] font-medium leading-6 text-navy">{task.title}</p>
      </td>

      <td className="px-6 py-7 align-middle">
        <span
          className={`
            inline-flex rounded px-3 py-2 text-[11px] font-bold uppercase
            ${STATUS_BADGE_COLORS[task.status]}
          `}
        >
          {formatStatusLabel(task.status)}
        </span>
      </td>

      <td className="px-6 py-7 align-middle">
        <span className="text-sm font-normal text-slate-darker">
          {formatTaskDueDate(task.due_date)}
        </span>
      </td>

      <td className="px-6 py-7 align-middle">
        <div className="flex items-center gap-3">
          <div
            className={`
              flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
              ${getAvatarColorClasses(assigneeName)}
            `}
          >
            {getAvatarInitials(assigneeName)}
          </div>

          <span className="text-base font-medium text-navy">{assigneeName}</span>
        </div>
      </td>

      <td className="px-6 py-7 align-middle">
        <ListDotsButton />
      </td>
    </tr>
  );
}

function TaskRowSkeleton() {
  return (
    <tr className="border-b border-[#EEF2F7] bg-white">
      <td className="px-6 py-7 align-middle">
        <div className="h-5 w-20 animate-pulse rounded bg-slate-lighter" />
      </td>

      <td className="px-6 py-7 align-middle">
        <div className="h-5 w-90 animate-pulse rounded bg-slate-lighter" />
      </td>

      <td className="px-6 py-7 align-middle">
        <div className="h-8 w-28 animate-pulse rounded bg-slate-lighter" />
      </td>

      <td className="px-6 py-7 align-middle">
        <div className="h-5 w-28 animate-pulse rounded bg-slate-lighter" />
      </td>

      <td className="px-6 py-7 align-middle">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-lighter" />
          <div className="h-5 w-28 animate-pulse rounded bg-slate-lighter" />
        </div>
      </td>

      <td className="px-6 py-7 align-middle">
        <div className="flex h-10 w-10 items-center justify-center">
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-lighter" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-lighter" />
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-lighter" />
          </div>
        </div>
      </td>
    </tr>
  );
}

const TABLE_COLUMNS = ["Task ID", "Title", "Status", "Due Date", "Assignee", ""];

function TasksTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full min-w-275 border-collapse">
        <thead>
          <tr className="border-b border-[#EEF2F7] bg-background">
            {TABLE_COLUMNS.map((column) => (
              <th
                key={column}
                className="px-6 py-5 text-left text-xs font-bold uppercase tracking-[1px] text-slate-darker"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function ListView({ tasks, loading, error, onTaskClick }: TasksArgs) {
  return (
    <div className="mt-10 w-full">
      {/* Handle Loading */}
      {loading && (
        <TasksTable>
          {Array.from({ length: 5 }).map((_, index) => (
            <TaskRowSkeleton key={index} />
          ))}
        </TasksTable>
      )}

      {/* Handle Error */}
      {!loading && error && (
        <div className="rounded-lg border border-[#E4E8F1] bg-white p-5 text-center text-sm font-semibold text-error">
          Failed to load tasks
        </div>
      )}

      {/* Display Table Of Tasks */}
      {!loading && !error && (
        <>
          <TasksTable>
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
          </TasksTable>

          {tasks.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center text-sm font-semibold text-slate shadow-sm">
              No tasks found
            </div>
          )}
        </>
      )}
    </div>
  );
}
