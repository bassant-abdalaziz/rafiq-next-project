"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Member, ProjectEpic, UpdateEpicPayload } from "@/types/project";
import { formatProjectDate, getAvatarInitials } from "@/utils/helpers";
import { LoadingDots } from "./loading-dots";
import CloseIcon from "@/assets/icons/close.svg";
import EpicIcon from "@/assets/icons/epic.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import NoTaskIcon from "@/assets/icons/no-task.svg";
import { toast } from "sonner";
import { useDebouncedCallback } from "@/hooks/use-debounced";

type EpicDetailsModalProps = {
  isOpen: boolean;
  epic: ProjectEpic | null;
  isLoading: boolean;
  error: string | null;
  projectMembers: Member[];
  onClose: () => void;
  onRetry: () => void;
  onUpdate: (payload: UpdateEpicPayload) => Promise<void>;
};

type EpicDetailsFormProps = {
  epic: ProjectEpic;
  projectMembers: Member[];
  onClose: () => void;
  onUpdate: (payload: UpdateEpicPayload) => Promise<void>;
};

function toDateInputValue(date?: string | null) {
  if (!date) return "";
  return date.slice(0, 10);
}

export function EpicDetailsModal({
  isOpen,
  epic,
  isLoading,
  error,
  projectMembers,
  onClose,
  onRetry,
  onUpdate,
}: EpicDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-navy/40 px-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl cursor-default overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="flex min-h-[320px] items-center justify-center p-8">
            <LoadingDots label="Loading epic details" />
          </div>
        )}

        {error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-lg font-bold text-navy">Something went wrong</p>
            <p className="max-w-sm text-sm text-slate">
              Failed to load epic details. Please try again.
            </p>
            <Button type="button" variant="primary" className="px-6" onClick={onRetry}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !error && epic && (
          <EpicDetailsForm
            key={epic.id}
            epic={epic}
            projectMembers={projectMembers}
            onClose={onClose}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
}

//Epic Edit Form
function EpicDetailsForm({ epic, projectMembers, onClose, onUpdate }: EpicDetailsFormProps) {
  const [title, setTitle] = useState(epic.title ?? "");
  const [description, setDescription] = useState(epic.description ?? "");
  const [deadline, setDeadline] = useState(toDateInputValue(epic.deadline));
  const [assigneeId, setAssigneeId] = useState(epic.assignee?.sub ?? "");

  // Update the server and rollback the UI if the update request fails.
  const updateWithRollback = async (payload: UpdateEpicPayload, rollback: () => void) => {
    try {
      await onUpdate(payload);
    } catch {
      rollback();
      toast.error("Failed to update epic. Please try again.");
    }
  };

  const saveTitleChange = useDebouncedCallback(async (value: string) => {
    const trimmedTitle = value.trim();
    const currentTitle = epic.title ?? "";

    if (!trimmedTitle) {
      setTitle(currentTitle);
      toast.error("Title is required.");
      return;
    }

    if (trimmedTitle === currentTitle) return;

    await updateWithRollback({ title: trimmedTitle }, () => setTitle(currentTitle));
  }, 600);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    saveTitleChange(value);
  };

  const saveDescriptionChange = useDebouncedCallback(async (value: string) => {
    const currentDescription = epic.description ?? "";
    const nextDescription = value.trim() ? value : null;

    if ((value || "") === currentDescription) return;

    await updateWithRollback({ description: nextDescription }, () =>
      setDescription(currentDescription)
    );
  }, 600);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    saveDescriptionChange(value);
  };

  const handleAssigneeChange = async (value: string) => {
    const previousValue = assigneeId;

    setAssigneeId(value);

    await updateWithRollback(
      {
        assignee_id: value || null,
      },
      () => setAssigneeId(previousValue)
    );
  };

  const handleDeadlineChange = async (value: string) => {
    const previousValue = deadline;

    setDeadline(value);

    await updateWithRollback(
      {
        deadline: value || null,
      },
      () => setDeadline(previousValue)
    );
  };

  return (
    <>
      {/*Header Card*/}
      <div className="flex items-center justify-between p-3 md:p-5">
        <div className="flex items-center gap-2">
          <EpicIcon aria-hidden="true" />
          <span className="text-xs font-bold text-primary">{epic.epic_id}</span>
        </div>

        <button type="button" aria-label="Close modal" onClick={onClose}>
          <CloseIcon aria-hidden="true" />
        </button>
      </div>

      {/* Inputs Card */}
      <div className="p-3 md:p-5">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate">Title</p>
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-lg border border-[#D8E1F5] px-4 py-3 text-lg font-bold text-navy outline-none focus:border-primary"
          />
        </div>

        <div className="mt-7">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate">
            Description
          </p>

          <textarea
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="No description provided"
            className="min-h-32 w-full resize-none rounded-lg border border-[#D8E1F5] px-4 py-3 text-sm text-navy outline-none focus:border-primary"
          />
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate">
              Created By
            </p>

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {getAvatarInitials(epic.created_by?.name)}
              </div>

              <p className="text-sm font-bold text-navy">{epic.created_by?.name}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate">
              Assignee
            </p>

            <select
              value={assigneeId}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#D8E1F5] px-3 text-sm font-bold text-navy outline-none focus:border-primary"
            >
              <option value="">Unassigned</option>

              {projectMembers.map((member) => (
                <option key={member.member_id} value={member.user_id}>
                  {member.metadata?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate">
              Deadline
            </p>

            <input
              type="date"
              value={deadline}
              onChange={(e) => handleDeadlineChange(e.target.value)}
              className="h-11 w-full rounded-lg border border-[#D8E1F5] px-3 text-sm font-bold text-navy outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate">Created At</p>
          <div className="flex items-center gap-1">
            <CalendarIcon aria-hidden="true" />
            <p className="text-sm font-bold text-navy">{formatProjectDate(epic.created_at)}</p>
          </div>
        </div>

        {/* Add Tasks Card */}
        <div className="mt-9">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-navy">Tasks</h3>

            <button type="button" className="text-sm font-bold text-primary">
              + Add Task
            </button>
          </div>

          <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-[#D8E1F5] bg-[#F4F7FF] p-6 text-center">
            <NoTaskIcon aria-label="no task added yet" />

            <p className="my-4 text-sm font-medium text-navy">
              No tasks have been added to this epic yet
            </p>

            <Button type="button" variant="primary" className="px-6">
              + Add Task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
