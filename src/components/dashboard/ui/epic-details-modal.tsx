"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Member, ProjectEpic, UpdateEpicPayload } from "@/types/project";
import { formatProjectDate, getAvatarInitials } from "@/utils/helpers";
import { LoadingDots } from "./loading-dots";
import CloseIcon from "@/assets/icons/close.svg";
import EpicIcon from "@/assets/icons/epic.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import { useDebouncedCallback } from "@/hooks/use-debounced";
import { EpicSchema, type EpicFormValues } from "@/schemas/project";
import { ReactSelectField } from "@/components/ui/react-select-field";
import { EpicTasksList } from "./epic-tasks-list";

type EpicDetailsModalProps = {
  isOpen: boolean;
  epic: ProjectEpic | null;
  isLoading: boolean;
  error: string | null;
  projectMembers: Member[];
  projectId: string;
  onClose: () => void;
  onRetry: () => void;
  onUpdate: (payload: UpdateEpicPayload) => Promise<void>;
};

type EpicDetailsFormProps = {
  epic: ProjectEpic;
  projectMembers: Member[];
  projectId: string;
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
  projectId,
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
            projectId={projectId}
            onClose={onClose}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
}

// Epic Edit Form
function EpicDetailsForm({
  epic,
  projectMembers,
  projectId,
  onClose,
  onUpdate,
}: EpicDetailsFormProps) {
  const {
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<EpicFormValues>({
    resolver: zodResolver(EpicSchema),
    mode: "onChange",
    defaultValues: {
      title: epic.title ?? "",
      description: epic.description ?? "",
      assignee_id: epic.assignee?.sub ?? "",
      deadline: toDateInputValue(epic.deadline),
    },
  });

  const description = watch("description") || "";

  const assigneeOptions = useMemo(() => {
    return [
      {
        value: "",
        label: "Unassigned",
      },
      ...projectMembers.map((member) => ({
        value: member.user_id,
        label: member.metadata?.name,
      })),
    ];
  }, [projectMembers]);

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
    const isValid = await trigger("title");

    if (!isValid) return;

    const trimmedTitle = value.trim();
    const currentTitle = epic.title ?? "";

    if (trimmedTitle === currentTitle) return;

    await updateWithRollback({ title: trimmedTitle }, () => {
      setValue("title", currentTitle, {
        shouldValidate: true,
        shouldDirty: false,
      });
    });
  }, 600);

  const saveDescriptionChange = useDebouncedCallback(async (value: string) => {
    const isValid = await trigger("description");

    if (!isValid) return;

    const currentDescription = epic.description ?? "";
    const nextDescription = value.trim() ? value : null;

    if ((value || "") === currentDescription) return;

    await updateWithRollback({ description: nextDescription }, () => {
      setValue("description", currentDescription, {
        shouldValidate: true,
        shouldDirty: false,
      });
    });
  }, 600);

  const handleAssigneeChange = async (value: string) => {
    const previousValue = epic.assignee?.sub ?? "";

    setValue("assignee_id", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    await updateWithRollback(
      {
        assignee_id: value || null,
      },
      () => {
        setValue("assignee_id", previousValue, {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
    );
  };

  const handleDeadlineChange = async (value: string) => {
    const previousValue = toDateInputValue(epic.deadline);

    setValue("deadline", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const isValid = await trigger("deadline");

    if (!isValid) return;

    await updateWithRollback(
      {
        deadline: value || null,
      },
      () => {
        setValue("deadline", previousValue, {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
    );
  };


  return (
    <>
      {/* Header Card */}
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

          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <input
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const value = e.target.value;

                  field.onChange(value);
                  saveTitleChange(value);
                }}
                className="w-full rounded-lg border border-[#D8E1F5] px-4 py-3 text-lg font-bold text-navy outline-none focus:border-primary"
              />
            )}
          />

          {errors.title?.message && (
            <p className="mt-2 text-xs font-semibold text-error">{errors.title.message}</p>
          )}
        </div>

        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate">Description</p>

            <span className="text-xs text-slate">{description.length}/500</span>
          </div>

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <textarea
                value={field.value ?? ""}
                onBlur={field.onBlur}
                onChange={(e) => {
                  const value = e.target.value;

                  field.onChange(value);
                  saveDescriptionChange(value);
                }}
                placeholder="No description provided"
                maxLength={500}
                className="min-h-32 w-full resize-none rounded-lg border border-[#D8E1F5] px-4 py-3 text-sm text-navy outline-none focus:border-primary"
              />
            )}
          />

          {errors.description?.message && (
            <p className="mt-2 text-xs font-semibold text-error">{errors.description.message}</p>
          )}
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
              Deadline
            </p>

            <Controller
              control={control}
              name="deadline"
              render={({ field }) => (
                <input
                  type="date"
                  value={field.value ?? ""}
                  onBlur={field.onBlur}
                  onChange={(e) => {
                    const value = e.target.value;

                    field.onChange(value);
                    void handleDeadlineChange(value);
                  }}
                  className="h-11 w-full rounded-lg border border-[#D8E1F5] px-3 text-sm font-bold text-navy outline-none focus:border-primary"
                />
              )}
            />

            {errors.deadline?.message && (
              <p className="mt-2 text-xs font-semibold text-error">{errors.deadline.message}</p>
            )}
          </div>

          <Controller
            control={control}
            name="assignee_id"
            render={({ field }) => (
              <ReactSelectField
                id="assignee_id"
                label="Assignee"
                value={field.value ?? ""}
                onChange={(value) => {
                  field.onChange(value);
                  void handleAssigneeChange(value);
                }}
                onBlur={field.onBlur}
                placeholder="Unassigned"
                error={errors.assignee_id?.message}
                options={assigneeOptions}
                isSearchable
                isClearable
              />
            )}
          />
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate">Created At</p>

          <div className="flex items-center gap-1">
            <CalendarIcon aria-hidden="true" />
            <p className="text-sm font-bold text-navy">{formatProjectDate(epic.created_at)}</p>
          </div>
        </div>

        {/* Add Tasks Card */}
        <EpicTasksList epicId={epic.id} projectId={projectId} onAddTaskClick={onClose} />
      </div>
    </>
  );
}
