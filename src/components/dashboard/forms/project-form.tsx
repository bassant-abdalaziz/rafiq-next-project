"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { createProject } from "@/actions/project";
import { getErrorMessage } from "@/utils/helpers";
import { ProjectSchema, type ProjectFormValues } from "@/schemas/project";

export function ProjectForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const description = watch("description") || "";

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const response = await createProject({
        name: data.name,
        description: data.description,
      });

      if (response.ok && response.status === 201) {
        toast.success("Project is created successfully");
        reset();
      }
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(`Failed to create project: ${message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Input
        id="name"
        label="Project Title *"
        type="text"
        placeholder="Enter project title"
        error={errors.name?.message}
        {...register("name")}
      />

      <Textarea
        id="description"
        label="Description"
        placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
        optionalText="Optional"
        maxLength={500}
        count={description.length}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="flex flex-col-reverse gap-4 pt-4 md:flex-row md:items-center md:justify-between">
        <Link
          href="/project"
          className="flex h-12 items-center justify-center rounded-lg text-sm font-semibold text-slate md:px-8"
        >
          Back
        </Link>

        <div className="w-full md:w-44">
          <Button type="submit" variant="primary" fullWidth isLoading={isSubmitting}>
            Create Project
          </Button>
        </div>
      </div>
    </form>
  );
}
