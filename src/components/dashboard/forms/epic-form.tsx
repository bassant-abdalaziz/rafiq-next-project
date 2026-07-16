"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ReactSelectField } from "@/components/ui/react-select-field";
import { getErrorMessage } from "@/utils/helpers";
import type { Member } from "@/types/project";
import { type EpicFormValues, EpicSchema } from "@/schemas/project";
import { createEpic } from "@/actions/project";

type EpicFormProps = {
  projectId: string;
  members: Member[];
};

export function EpicForm({ projectId, members }: EpicFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EpicFormValues>({
    resolver: zodResolver(EpicSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      assignee_id: "",
      deadline: "",
    },
  });

  const description = watch("description") || "";

  const assigneeOptions = members.map((member) => ({
    value: member.user_id,
    label: member.metadata?.name,
  }));

  const onSubmit = async (data: EpicFormValues) => {
    try {
      const response = await createEpic({
        title: data.title,
        description: data.description || null,
        assignee_id: data.assignee_id || null,
        deadline: data.deadline || null,
        project_id: projectId,
      });

      if (response.ok && response.status === 201) {
        toast.success("Epic is created successfully");
        reset();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Input
        id="title"
        label="Title *"
        type="text"
        placeholder="e.g. Structural Schematic Phase"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        id="description"
        label="Description"
        placeholder="Describe the scope and objectives of this epic..."
        optionalText="Optional"
        maxLength={500}
        count={description.length}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          id="deadline"
          label="Deadline"
          type="date"
          error={errors.deadline?.message}
          {...register("deadline")}
        />

        <div className="mt-2">
          {" "}
          <Controller
            control={control}
            name="assignee_id"
            render={({ field }) => (
              <ReactSelectField
                id="assignee_id"
                label="Assignee"
                placeholder="Select a member..."
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
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-[#EEF1F7] pt-8 md:flex-row md:items-center md:justify-end">
        <Link
          href={`/project/${projectId}/epics`}
          className="flex h-12 items-center justify-center rounded-lg text-sm font-semibold text-slate md:px-8"
        >
          Cancel
        </Link>

        <div className="w-full md:w-44">
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Create Epic
          </Button>
        </div>
      </div>
    </form>
  );
}
