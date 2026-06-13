"use server";

import { apiFetch } from "@/lib/api";
import { Project, ProjectPayload } from "@/types/project";

export async function createProject(data: ProjectPayload) {
  return apiFetch("/rest/v1/projects", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(data),
  });
}

export async function getProjects() {
  const response = await apiFetch<Project[]>("/rest/v1/rpc/get_projects", {
    method: "GET",
    requiresAuth: true,
  });

  return response.data;
}