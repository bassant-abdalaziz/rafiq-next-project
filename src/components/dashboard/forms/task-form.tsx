"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { createTask } from "@/actions/project";
import { getErrorMessage } from "@/utils/helpers";
import type { Member } from "@/types/project";
import { TASK_STATUS_OPTIONS } from "@/constants";
import { type TaskFormValues, TaskSchema } from "@/schemas/project";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllProjectEpics } from "@/redux/slices/projectEpicsSlice";

type TaskFormProps = {
  projectId: string;
  members: Member[];
  initialEpicId?: string;
};

function formatStatusLabel(status: string) {
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

export function TaskForm({ projectId, members, initialEpicId = "" }: TaskFormProps) {
  const { projectEpics, hasFetched, fetchedProjectId } = useAppSelector(
    (state) => state.projectEpics
  );

  const dispatch = useAppDispatch();
  useEffect(() => {
    const shouldFetchEpics = !hasFetched || fetchedProjectId !== projectId;

    if (shouldFetchEpics) {
      dispatch(
        fetchAllProjectEpics({
          projectId,
          limit: 1000,
          offset: 0,
          mode: "replace",
        })
      );
    }
  }, [dispatch, projectId, hasFetched, fetchedProjectId]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      status: "TO_DO",
      epic_id: initialEpicId,
      assignee_id: "",
      due_date: "",
      description: "",
    },
  });

  const description = watch("description") || "";

  const epicOptions = useMemo(() => {
    return projectEpics.map((epic) => ({
      value: epic.id,
      label: `${truncateText(epic.title)}`,
    }));
  }, [projectEpics]);

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
          status: "TO_DO",
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
        <Select
          id="status"
          label="Status *"
          error={errors.status?.message}
          options={TASK_STATUS_OPTIONS.map((status) => ({
            value: status,
            label: formatStatusLabel(status),
          }))}
          {...register("status")}
        />

        <Select
          id="assignee_id"
          label="Assignee"
          placeholder="Select Team Member"
          error={errors.assignee_id?.message}
          options={members.map((member) => ({
            value: member.user_id,
            label: member.metadata?.name ?? member.user_id,
          }))}
          {...register("assignee_id")}
        />
      </div>

      <Select
        id="epic_id"
        label="Epic"
        error={errors.epic_id?.message}
        options={epicOptions}
        {...register("epic_id")}
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
