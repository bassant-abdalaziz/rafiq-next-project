"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getEpicTasks } from "@/actions/project";
import { TaskPayload } from "@/types/project";
import { getAvatarColorClasses, getAvatarInitials } from "@/utils/helpers";
import { LoadingDots } from "./loading-dots";
import NoTaskIcon from "@/assets/icons/no-task.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";

type EpicTasksListProps = {
  epicId: string;
  projectId: string;
  onAddTaskClick: () => void;
};

function formatTaskDueDate(value?: string | null) {
  if (!value) return "No due date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTaskDueDateMobile(value?: string | null) {
  return formatTaskDueDate(value).toUpperCase();
}

function isTaskOverdue(task: TaskPayload) {
  if (!task.due_date) return false;
  if (task.status === "DONE") return false;

  const dueDate = new Date(task.due_date);
  const today = new Date();

  if (Number.isNaN(dueDate.getTime())) return false;

  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function TaskAssignee({ task }: { task: TaskPayload }) {
  const assigneeName = task.assignee?.name ?? "Unassigned";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`
          flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold
          ${getAvatarColorClasses(assigneeName)}
        `}
      >
        {getAvatarInitials(assigneeName)}
      </div>

      <span className="text-xs font-medium text-slate">{assigneeName}</span>
    </div>
  );
}

function EpicTaskRow({ task }: { task: TaskPayload }) {
  const isOverdue = isTaskOverdue(task);

  return (
    <div className="grid border-b border-[#EEF1F7] px-4 py-4 last:border-b-0 md:grid-cols-[1fr_130px] md:items-center">
      <div>
        <p className="text-sm font-bold leading-5 text-navy md:text-base">{task.title}</p>

        <div className="mt-3">
          <TaskAssignee task={task} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between md:mt-0 md:block md:text-right">
        <p className="hidden text-[10px] font-bold uppercase tracking-wide text-slate/60 md:block">
          Due Date
        </p>

        <div
          className={`
            flex items-center gap-1 text-[11px] font-bold md:mt-1 md:block md:text-xs md:font-medium
            ${isOverdue ? "text-error" : "text-slate"}
          `}
        >
          <span className="md:hidden">
            {isOverdue ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-error text-[10px] leading-none">
                !
              </span>
            ) : (
              <CalendarIcon aria-hidden="true" />
            )}
          </span>

          <span>{isOverdue ? "OVERDUE" : formatTaskDueDateMobile(task.due_date)}</span>
        </div>
      </div>
    </div>
  );
}

export function EpicTasksList({ epicId, projectId, onAddTaskClick }: EpicTasksListProps) {
  const [tasks, setTasks] = useState<TaskPayload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTaskHref = `/project/${projectId}/tasks/new?epicId=${epicId}`;

  useEffect(() => {
    const loadEpicTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getEpicTasks(epicId);

        setTasks(response);
      } catch {
        setError("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEpicTasks();
  }, [epicId]);

  return (
    <div className="mt-9">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.8px] text-slate md:text-lg md:normal-case md:tracking-normal md:text-navy">
            Tasks
          </h3>

          {!isLoading && !error && tasks.length > 0 && (
            <span className="rounded-full bg-[#EEF3FF] px-3 py-1 text-[10px] font-bold uppercase text-slate">
              {tasks.length} tasks
            </span>
          )}
        </div>

        <Link
          href={createTaskHref}
          onClick={onAddTaskClick}
          className="hidden text-sm font-bold text-primary md:block"
        >
          + Add Task
        </Link>
      </div>

      {/* Handle Loading */}
      {isLoading && (
        <div className="flex min-h-36 items-center justify-center rounded-lg border border-[#D8E1F5] bg-white">
          <LoadingDots label="Loading tasks" />
        </div>
      )}

      {/* Handle Error */}
      {!isLoading && error && (
        <div className="flex min-h-32 items-center justify-center rounded-lg border border-[#D8E1F5] bg-white p-6 text-center">
          <p className="text-sm font-semibold text-error">Failed to load tasks</p>
        </div>
      )}

      {/* Handle State Of Empty Tasks */}
      {!isLoading && !error && tasks.length === 0 && (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-[#D8E1F5] bg-[#F4F7FF] p-6 text-center">
          <NoTaskIcon aria-label="no task added yet" />

          <p className="my-4 text-sm font-medium text-navy">No tasks found for this epic</p>

          <Link href={createTaskHref} onClick={onAddTaskClick}>
            <Button type="button" variant="primary" className="px-6">
              + Add Task
            </Button>
          </Link>
        </div>
      )}

      {/* Handle List Of Tasks */}
      {!isLoading && !error && tasks.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-[#E4E8F1] bg-white">
          {tasks.map((task) => (
            <EpicTaskRow key={task.id} task={task} />
          ))}

          <Link
            href={createTaskHref}
            onClick={onAddTaskClick}
            className="flex h-16 items-center justify-center gap-3 border-t border-dashed border-[#D8E1F5] text-sm font-bold uppercase tracking-[2px] text-slate/60 md:hidden"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate/50 text-base leading-none">
              +
            </span>
            Add New Task
          </Link>
        </div>
      )}
    </div>
  );
}
