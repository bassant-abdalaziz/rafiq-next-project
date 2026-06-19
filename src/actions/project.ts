"use server";

import { apiFetch } from "@/lib/api";
import { Member, Project, ProjectPayload } from "@/types/project";

export async function createProject(data: ProjectPayload) {
  return apiFetch("/rest/v1/projects", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(data),
  });
}

export async function getProjects(limit: number, offset: number) {
  const response = await apiFetch<Project[]>(
    `/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      requiresAuth: true,
      headers: {
        Prefer: "count=exact",
      },
    }
  );

  const contentRange = response.headers.get("content-range");

  const totalCount = contentRange ? Number(contentRange.split("/")[1]) : 0;

  return {
    projects: response.data,
    totalCount,
  };
}

export async function getProjectMembers(projectId: string) {
  const response = await apiFetch<Member[]>(
    `/rest/v1/get_project_members?project_id=eq.${projectId}`,
    {
      method: "GET",
      requiresAuth: true,
    }
  );

  return {
    data: response.data,
  };
}
