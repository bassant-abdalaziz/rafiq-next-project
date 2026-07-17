"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getProjectTasksByStatus } from "@/actions/project";
import { TASK_STATUS_OPTIONS } from "@/constants";
import { TaskPayload } from "@/types/project";
import {
  formatProjectDate,
  getAvatarColorClasses,
  getAvatarInitials,
  STATUS_BADGE_COLORS,
  STATUS_COLORS,
} from "@/utils/helpers";
import CalendarIcon from "@/assets/icons/calendar.svg";
import DelayedIcon from "@/assets/icons/Delayed.svg";
import AddNewTaskIcon from "@/assets/icons/add-new-task.svg";

type BoardViewProps = {
  projectId: string;
};

type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number];

function formatStatusLabel(status: TaskStatus) {
  return status.replaceAll("_", " ");
}

function formatTaskDueDate(value?: string | null) {
  if (!value) return "No due date";

  return formatProjectDate(value);
}

function getDueDateLabel(task: TaskPayload) {
  if (!task.due_date) return "No due date";

  const dueDate = new Date(task.due_date);
  const today = new Date();

  if (Number.isNaN(dueDate.getTime())) {
    return "No due date";
  }

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (task.status !== "DONE" && dueDate < today) {
    return "DELAYED";
  }

  if (dueDate.getTime() === today.getTime()) {
    return "TODAY";
  }

  return formatTaskDueDate(task.due_date);
}

function isDelayed(task: TaskPayload) {
  return getDueDateLabel(task) === "DELAYED";
}

function TaskCard({ task }: { task: TaskPayload }) {
  const assigneeName = task.assignee?.name ?? "Unassigned";
  const dueDateLabel = getDueDateLabel(task);
  const delayed = isDelayed(task);

  return (
    <div
      className={`
        rounded-lg border border-transparent  p-5 shadow-sm
        ${delayed ? " bg-light-error" : " bg-white"}
        ${task.status === "IN_PROGRESS" ? "border-l-4 border-l-primary" : ""}
      `}
    >
      <p className=" text-sm font-semibold leading-6 text-navy">{task.title}</p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div
          className={`
            flex items-center gap-2 text-xs font-bold uppercase
            ${delayed ? "text-error" : dueDateLabel === "TODAY" ? "text-primary" : "text-slate"}
          `}
        >
          {delayed ? <DelayedIcon aria-hidden="true" /> : <CalendarIcon aria-hidden="true" />}

          <span>{dueDateLabel}</span>
        </div>

        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full  text-[10px] font-bold  ${getAvatarColorClasses(assigneeName)}`}
        >
          {getAvatarInitials(assigneeName)}
        </div>
      </div>
    </div>
  );
}

function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border border-transparent bg-white p-5 shadow-sm">
      <div className="min-h-12">
        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-lighter" />
        <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-slate-lighter" />
      </div>

      <div className="flex items-center justify-between gap-4 mt-5">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-lighter" />
        <div className="h-4 w-4 animate-pulse rounded bg-slate-lighter" />
      </div>
    </div>
  );
}

function BoardColumn({ projectId, status }: { projectId: string; status: TaskStatus }) {
  const [tasks, setTasks] = useState<TaskPayload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const createTaskHref = `/project/${projectId}/tasks/new?status=${status}`;

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const response = await getProjectTasksByStatus(projectId, status);

        setTasks(response);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadTasks();
  }, [projectId, status]);

  return (
    <div className="w-full">
      {/* Handle  Status Header With Length And Status Name*/}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${STATUS_COLORS[status]}`} />

          <h3 className="text-xs font-bold uppercase tracking-[1.5px] text-[#64748B]">
            {formatStatusLabel(status)}
          </h3>

          <span
            className={`rounded px-1.5 py-0.5 text-xs font-bold ${STATUS_BADGE_COLORS[status]}`}
          >
            {tasks.length}
          </span>
        </div>

        <Link
          href={createTaskHref}
          className="flex h-8 w-8 items-center justify-center rounded-md text-2xl font-light text-slate transition hover:bg-white hover:text-primary"
          aria-label={`Create task in ${formatStatusLabel(status)}`}
        >
          +
        </Link>
      </div>
      {/* Redirect To Add Task With Status  */}
      <Link
        href={createTaskHref}
        className="mb-5 flex h-16 items-center justify-center gap-2 rounded-lg border border-dashed border-[#D8E1F5] text-sm font-bold uppercase tracking-[2px] text-slate/60 transition"
      >
        <AddNewTaskIcon aria-hidden="true" />
        Add New Task
      </Link>

      {/* Handle Loading */}
      {isLoading && (
        <div className="space-y-4">
          <TaskCardSkeleton />
        </div>
      )}

      {/* Handle Error */}
      {!isLoading && error && (
        <div className="rounded-lg border border-[#E4E8F1] bg-white p-5 text-sm font-semibold text-center text-error">
          Failed to load tasks
        </div>
      )}

      {/* Display Card Of Task Based On Status */}
      {!isLoading && tasks.length === 0 ? (
        <div className="p-8 text-center text-sm font-semibold text-slate">No tasks found</div>
      ) : (
        !isLoading &&
        !error && (
          <div className="space-y-8">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export function BoardView({ projectId }: BoardViewProps) {
  const columnWidth = 380;
  const columnGap = 24;
  const columnsCount = TASK_STATUS_OPTIONS.length;

  const boardWidth = columnsCount * columnWidth + (columnsCount - 1) * columnGap;

  return (
    <div className="mt-10 hidden md:block">
      <div
        className="
          overflow-x-scroll overflow-y-visible pb-6
        "
        style={{
          width: "calc(100vw - 320px)",
          maxWidth: "100%",
          scrollbarWidth: "auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columnsCount}, ${columnWidth}px)`,
            columnGap,
            width: boardWidth,
          }}
        >
          {TASK_STATUS_OPTIONS.map((status) => (
            <BoardColumn key={status} projectId={projectId} status={status} />
          ))}
        </div>
      </div>
    </div>
  );
}
