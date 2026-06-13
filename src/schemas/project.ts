import { z } from "zod";

export const ProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project title is required.")
    .min(3, "Project name must be at least 3 characters.")
    .max(100, "Project name must not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters.")
    .optional(),
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;