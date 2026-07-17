"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ReactSelectField } from "@/components/ui/react-select-field";
import { createTask, getProjectEpics } from "@/actions/project";
import { getErrorMessage } from "@/utils/helpers";
import type { Member, ProjectEpic, TaskStatus } from "@/types/project";
import { TASK_STATUS_OPTIONS } from "@/constants";
import { type TaskFormValues, TaskSchema } from "@/schemas/project";

type TaskFormProps = {
  projectId: string;
  members: Member[];
  initialEpicId?: string;
  initialStatus?: TaskStatus;
};

function formatStatusLabel(status: TaskStatus) {
  return status.replaceAll("_", " ");
}

function truncateText(text: string, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function toIsoDateTime(value?: string) {
  if (!value) return null;
  return new Date(value).toISOString();
}

export function TaskForm({
  projectId,
  members,
  initialEpicId = "",
  initialStatus = "TO_DO",
}: TaskFormProps) {
  const [projectEpics, setProjectEpics] = useState<ProjectEpic[]>([]);
  const [isEpicsLoading, setIsEpicsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      status: initialStatus,
      epic_id: initialEpicId,
      assignee_id: "",
      due_date: "",
      description: "",
    },
  });

  const description = watch("description") || "";

  useEffect(() => {
    const loadProjectEpics = async () => {
      setIsEpicsLoading(true);

      try {
        const response = await getProjectEpics(projectId, 1000, 0);

        setProjectEpics(response.projectEpics);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setIsEpicsLoading(false);
      }
    };

    void loadProjectEpics();
  }, [projectId]);

  const epicOptions = useMemo(() => {
    return projectEpics.map((epic) => ({
      value: epic.id,
      label: ` ${truncateText(epic.title)}`,
    }));
  }, [projectEpics]);

  const statusOptions = useMemo(() => {
    return TASK_STATUS_OPTIONS.map((status) => ({
      value: status,
      label: formatStatusLabel(status),
    }));
  }, []);

  const assigneeOptions = useMemo(() => {
    return members.map((member) => ({
      value: member.user_id,
      label: member.metadata?.name ?? member.user_id,
    }));
  }, [members]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      const response = await createTask({
        project_id: projectId,
        title: data.title,
        status: data.status || "TO_DO",
        epic_id: data.epic_id || null,
        assignee_id: data.assignee_id || null,
        due_date: toIsoDateTime(data.due_date),
        description: data.description || null,
      });

      if (response.ok && response.status === 201) {
        toast.success("Task is created successfully");

        reset({
          title: "",
          status: initialStatus,
          epic_id: initialEpicId,
          assignee_id: "",
          due_date: "",
          description: "",
        });
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Input
        id="title"
        label="Title *"
        type="text"
        placeholder="e.g., Finalize structural schematics"
        error={errors.title?.message}
        {...register("title")}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <ReactSelectField
              id="status"
              label="Status *"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.status?.message}
              options={statusOptions}
              isSearchable={false}
              isClearable={false}
            />
          )}
        />

        <Controller
          control={control}
          name="assignee_id"
          render={({ field }) => (
            <ReactSelectField
              id="assignee_id"
              label="Assignee"
              placeholder="Select Team Member"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.assignee_id?.message}
              options={assigneeOptions}
              isSearchable
              isClearable
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="epic_id"
        render={({ field }) => (
          <ReactSelectField
            id="epic_id"
            label="Epic"
            placeholder="Select an epic..."
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.epic_id?.message}
            options={epicOptions}
            isSearchable={false}
            isClearable
            isLoading={isEpicsLoading}
            noOptionsMessage="No epics found"
            loadingMessage="Loading epics..."
          />
        )}
      />

      <Input
        id="due_date"
        label="Due Date"
        type="datetime-local"
        error={errors.due_date?.message}
        {...register("due_date")}
      />

      <Textarea
        id="description"
        label="Description"
        placeholder="Provide detailed context for this task..."
        optionalText="Optional"
        maxLength={500}
        count={description.length}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="flex flex-col-reverse gap-4 border-t border-[#EEF1F7] pt-8 md:flex-row md:items-center md:justify-end">
        <Link
          href={`/project/${projectId}/tasks`}
          className="flex h-12 items-center justify-center rounded-lg text-sm font-semibold text-slate md:px-8"
        >
          Back
        </Link>

        <div className="w-full md:w-44">
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Create Task
          </Button>
        </div>
      </div>
    </form>
  );
}
