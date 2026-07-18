"use client";

import { ReactNode, useEffect, useState } from "react";
import { getProjectTaskDetails } from "@/actions/project";
import { TaskPayload, TaskStatus } from "@/types/project";
import {
  formatStatusLabel,
  getAvatarColorClasses,
  getAvatarInitials,
  STATUS_BADGE_COLORS,
} from "@/utils/helpers";
import CloseIcon from "@/assets/icons/close.svg";
import EpicIcon from "@/assets/icons/epics.svg";
import CopyLinkIcon from "@/assets/icons/copy-link.svg";
import CheckMiniIcon from "@/assets/icons/check-mini.svg";
import ClockIcon from "@/assets/icons/task-clock.svg";
import CalendarIcon from "@/assets/icons/task-calendar.svg";

type TaskDetailsPopupProps = {
  projectId: string;
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
};

function formatDetailsDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function PersonInfo({ name, subtitle }: { name: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-3">
      <div
        className={`
          flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
          ${getAvatarColorClasses(name)}
        `}
      >
        {getAvatarInitials(name)}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-navy">{name}</p>

        {subtitle && <p className="truncate text-xs font-medium text-slate">{subtitle}</p>}
      </div>
    </div>
  );
}

function TaskDetailsSkeleton() {
  return (
    <div className="grid min-h-155 w-full md:grid-cols-[1fr_330px]">
      <div className="bg-white">
        <div className="border-b border-[#EEF2F7] p-8">
          <div className="h-6 w-28 animate-pulse rounded bg-slate-lighter" />
          <div className="mt-5 h-9 w-3/4 animate-pulse rounded bg-slate-lighter" />
          <div className="mt-3 h-9 w-1/2 animate-pulse rounded bg-slate-lighter" />
        </div>

        <div className="p-8">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-lighter" />
          <div className="mt-5 space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-slate-lighter" />
            <div className="h-5 w-5/6 animate-pulse rounded bg-slate-lighter" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-lighter" />
          </div>
        </div>
      </div>

      <div className="bg-[#F2F5FF] p-8">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-lighter" />
        <div className="mt-5 h-12 w-full animate-pulse rounded bg-slate-lighter" />

        <div className="mt-10 h-4 w-24 animate-pulse rounded bg-slate-lighter" />
        <div className="mt-5 h-16 w-full animate-pulse rounded bg-slate-lighter" />

        <div className="mt-10 h-4 w-24 animate-pulse rounded bg-slate-lighter" />
        <div className="mt-5 h-10 w-2/3 animate-pulse rounded bg-slate-lighter" />
      </div>
    </div>
  );
}

function MobileSheetShell({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[28px] bg-[#F7F9FF] px-6 pb-8 pt-4 shadow-2xl md:hidden"
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="mx-auto mb-8 h-1 w-14 rounded-full bg-[#DDE5F6]" />

      {children}
    </div>
  );
}

function MobileStatusBadge({ status }: { status: TaskStatus }) {
  const isCompleted = status === "DONE";

  return (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase
        ${STATUS_BADGE_COLORS[status]}
      `}
    >
      {isCompleted && <CheckMiniIcon />}

      {formatStatusLabel(status)}
    </span>
  );
}

function MobileEpicBadge({ epicId }: { epicId?: string | null }) {
  if (!epicId) return null;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-light-navy px-4 py-2 text-xs font-bold text-[#374763]">
      <EpicIcon />
      {epicId}
    </span>
  );
}

function MobilePersonBlock({ name }: { name: string }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div
        className={`
          flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium
          ${getAvatarColorClasses(name)}
        `}
      >
        {getAvatarInitials(name)}
      </div>

      <p className="truncate text-base font-medium text-navy">{name}</p>
    </div>
  );
}

function MobileInfoCard({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="min-h-28 rounded-xl bg-surface-low p-5 shadow-sm">
      {label && <p className="text-xs font-bold uppercase text-slate-dark">{label}</p>}

      {children}
    </div>
  );
}

function MobileDateValue({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex h-full items-center gap-3 text-navy">
      <span className="text-primary">{icon}</span>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function TaskDetailsMobileSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <MobileSheetShell onClose={onClose}>
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 animate-pulse rounded bg-slate-lighter" />

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center text-slate-darker"
          aria-label="Close task details"
        >
          <CloseIcon aria-hidden="true" />
        </button>
      </div>

      <div className="mt-8 space-y-3">
        <div className="h-8 w-full animate-pulse rounded bg-slate-lighter" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-slate-lighter" />
      </div>

      <div className="mt-7 flex gap-3">
        <div className="h-10 w-32 animate-pulse rounded-full bg-slate-lighter" />
        <div className="h-10 w-28 animate-pulse rounded-full bg-slate-lighter" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="h-28 animate-pulse rounded-xl bg-white" />
        <div className="h-28 animate-pulse rounded-xl bg-white" />
        <div className="h-28 animate-pulse rounded-xl bg-white" />
        <div className="h-28 animate-pulse rounded-xl bg-white" />
      </div>

      <div className="mt-10 h-5 w-32 animate-pulse rounded bg-slate-lighter" />
      <div className="mt-5 h-44 animate-pulse rounded-xl bg-white" />
    </MobileSheetShell>
  );
}

function TaskDetailsBottomSheet({
  task,
  loading,
  error,
  onClose,
}: {
  task: TaskPayload | null;
  loading: boolean;
  error: boolean;
  onClose: () => void;
}) {
  // Handle Loading
  if (loading) {
    return <TaskDetailsMobileSkeleton onClose={onClose} />;
  }
  // Handle Error
  if (error) {
    return (
      <MobileSheetShell onClose={onClose}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold uppercase tracking-[1px] text-slate-darker">
            Task Details
          </p>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-slate-darker"
            aria-label="Close task details"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </div>

        <div className="mt-10 rounded-xl bg-white p-6 text-center text-sm font-semibold text-error shadow-sm">
          Failed to load task details
        </div>
      </MobileSheetShell>
    );
  }

  if (!task) {
    return (
      <MobileSheetShell onClose={onClose}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold uppercase tracking-[1px] text-slate-darker">
            Task Details
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-bold text-slate shadow-sm transition hover:text-error"
            aria-label="Close task details"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </div>

        <div className="mt-10 rounded-xl bg-white p-6 text-center text-sm font-semibold text-slate shadow-sm">
          Task not found
        </div>
      </MobileSheetShell>
    );
  }

  const assigneeName = task.assignee?.name ?? "Unassigned";
  const reporterName = task.created_by?.name ?? "Unknown reporter";

  return (
    <MobileSheetShell onClose={onClose}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[1px] text-slate">{task.task_id}</p>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-slate-darker"
          aria-label="Close task details"
        >
          <CloseIcon aria-hidden="true" />
        </button>
      </div>

      <h2 className="mt-4 text-[24px] font-semibold leading-9 text-navy">{task.title}</h2>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <MobileStatusBadge status={task.status} />
        <MobileEpicBadge epicId={task.epic?.epic_id} />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <MobileInfoCard label="Assignee">
          <MobilePersonBlock name={assigneeName} />
        </MobileInfoCard>

        <MobileInfoCard>
          <MobileDateValue icon={<CalendarIcon />} value={formatDetailsDate(task.due_date)} />
        </MobileInfoCard>

        <MobileInfoCard label="Created By">
          <MobilePersonBlock name={reporterName} />
        </MobileInfoCard>

        <MobileInfoCard label="Created At">
          <MobileDateValue icon={<ClockIcon />} value={formatDetailsDate(task.created_at)} />
        </MobileInfoCard>
      </div>

      <div className="mt-10">
        <p className="text-sm font-bold uppercase text-slate-dark">Description</p>

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
          <p className="whitespace-pre-line text-sm font-normal leading-8 text-slate-darker">
            {task.description || "No description provided."}
          </p>
        </div>
      </div>
    </MobileSheetShell>
  );
}
// Desktop Popup
function DesktopTaskDetailsDialog({
  task,
  loading,
  error,
  onClose,
}: {
  task: TaskPayload | null;
  loading: boolean;
  error: boolean;
  onClose: () => void;
}) {
  const assigneeName = task?.assignee?.name ?? "Unassigned";
  const reporterName = task?.created_by?.name ?? "Unknown reporter";
  const department = task?.assignee?.department ?? "";

  const handleCopyTaskLink = () => {
    if (!task?.id) return;

    const url = new URL(window.location.href);

    url.searchParams.set("taskId", task.id);

    void navigator.clipboard.writeText(url.toString());
  };

  return (
    <div className="relative hidden max-h-[92dvh] w-full max-w-232 overflow-hidden rounded-xl bg-white shadow-2xl md:block">
      {/* Handle Loading */}
      {loading && <TaskDetailsSkeleton />}

      {/* Handle Error */}
      {!loading && error && (
        <div className="p-10 text-center text-sm font-semibold text-error">
          Failed to load task details
        </div>
      )}
      {/* Handle State With No Task */}
      {!loading && !error && !task && (
        <div className="p-10 text-center text-sm font-semibold text-slate">Task not found</div>
      )}
      {/* Handle State With Existing Task */}
      {!loading && !error && task && (
        <div className="grid max-h-[92dvh] overflow-y-auto md:grid-cols-[1fr_330px]">
          <div className="flex min-h-155 flex-col bg-white">
            <div className="border-b border-[#EEF2F7] p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded bg-light-navy px-3 py-1 text-xs font-extrabold uppercase text-primary">
                  {task.task_id}
                </span>

                {task.epic?.epic_id && (
                  <div className="flex items-center justify-center gap-2">
                    <EpicIcon aria-hidden="true" />

                    <span className="text-sm font-medium text-slate-dark">{task.epic.epic_id}</span>
                  </div>
                )}
              </div>

              <h2 className="mt-4 max-w-155 text-3xl font-bold leading-10 text-navy">
                {task.title}
              </h2>
            </div>

            <div className="flex-1 p-8">
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-darker">
                Description
              </p>

              <p className="mt-3 max-w-155 whitespace-pre-line text-sm font-normal leading-7 text-navy">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#EEF2F7] bg-surface-low px-8 py-4">
              <div
                onClick={handleCopyTaskLink}
                className="text-sm font-medium text-slate-darker cursor-pointer flex items-center justify-center gap-2"
              >
                <CopyLinkIcon aria-hidden="true" />
                <span> Copy link</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-md bg-surface-highest px-6 py-3 text-sm font-bold text-navy transition hover:bg-primary hover:text-white"
              >
                Close
              </button>
            </div>
          </div>

          <aside className="bg-surface-low p-8">
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-darker">
              Status
            </p>

            <span
              className={`
                mt-5 inline-flex w-full items-center justify-between rounded-md px-4 py-4 text-sm font-extrabold uppercase
                ${STATUS_BADGE_COLORS[task.status]}
              `}
            >
              {formatStatusLabel(task.status)}
            </span>

            <div className="mt-10">
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-darker ">
                Assignee
              </p>

              <div className="mt-4">
                <PersonInfo name={assigneeName} subtitle={department} />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-darker ">
                Reporter
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold
                    ${getAvatarColorClasses(reporterName)}
                  `}
                >
                  {getAvatarInitials(reporterName)}
                </div>

                <p className="text-sm font-bold text-navy">{reporterName}</p>
              </div>
            </div>

            <div className="mt-8 border-t border-[#DDE5F6] pt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-darker">Due Date</p>
                <p className="text-sm  font-medium text-navy">{formatDetailsDate(task.due_date)}</p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-darker">Created At</p>
                <p className="text-sm  font-medium text-navy">
                  {formatDetailsDate(task.created_at)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export function TaskDetailsPopup({ projectId, taskId, isOpen, onClose }: TaskDetailsPopupProps) {
  const [task, setTask] = useState<TaskPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //fetch data when open popup and task id exists
  useEffect(() => {
    if (!isOpen || !taskId) return;

    const loadTaskDetails = async () => {
      setLoading(true);
      setError(false);
      setTask(null);

      try {
        const response = await getProjectTaskDetails(projectId, taskId);

        setTask(response);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    void loadTaskDetails();
  }, [isOpen, projectId, taskId]);

  //handle if user click esc from keyboard to close popup
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-0 backdrop-blur-sm md:items-center md:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Desktop Popup  */}
      <DesktopTaskDetailsDialog task={task} loading={loading} error={error} onClose={onClose} />

      {/* Mobile Bottom Sheet */}
      <TaskDetailsBottomSheet task={task} loading={loading} error={error} onClose={onClose} />
    </div>
  );
}
