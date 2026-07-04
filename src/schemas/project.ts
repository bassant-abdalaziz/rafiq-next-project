import { z } from "zod";

export const ProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project title is required.")
    .min(3, "Project name must be at least 3 characters.")
    .max(100, "Project name must not exceed 100 characters."),

  description: z.string().trim().max(500, "Description must not exceed 500 characters.").optional(),
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;

const today = new Date();
today.setHours(0, 0, 0, 0);

export const EpicSchema = z.object({
  title: z.string().min(3, "Title is required (minimum 3 characters)"),

  description: z.string().optional(),

  assignee_id: z.string().optional(),

  deadline: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;

      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);

      return selectedDate >= today;
    }, "Deadline must be today or in the future"),
});

export type EpicFormValues = z.infer<typeof EpicSchema>;

export const TaskStatusSchema = z.enum([
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
]);

export const TaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  status: TaskStatusSchema,
  epic_id: z.string().optional(),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
  description: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof TaskSchema>;
