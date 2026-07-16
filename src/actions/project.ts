"use server";

import { apiFetch } from "@/lib/api";
import {
  CreateEpicPayload,
  CreateTaskPayload,
  Member,
  Project,
  ProjectEpic,
  ProjectPayload,
  TaskPayload,
  UpdateEpicPayload,
} from "@/types/project";

/* <<<<<<<<<<<<<<< PROJECTS >>>>>>>>>>>>>>>>> */
//Create Project
export async function createProject(data: ProjectPayload) {
  return apiFetch("/rest/v1/projects", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(data),
  });
}

//Update Project
export async function updateProject(
  projectId: string,
  projectData: {
    name: string;
    description?: string;
  }
) {
  const response = await apiFetch<Project[]>(`/rest/v1/projects?id=eq.${projectId}`, {
    method: "PATCH",
    requiresAuth: true,

    body: JSON.stringify({
      name: projectData.name,
      description: projectData.description,
    }),
  });

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
  };
}

//Get All Projects
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
//Get Project By ID
export async function getProjectByID(projectId: string) {
  const response = await apiFetch<Project[]>(`/rest/v1/rpc/get_projects?id=eq.${projectId}`, {
    method: "GET",
    requiresAuth: true,
  });

  return {
    data: response.data[0],
  };
}

/* <<<<<<<<<<<<<<< MEMBERS >>>>>>>>>>>>>>>>> */
//Get All Members Of Project
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

/* <<<<<<<<<<<<<<< EPICS >>>>>>>>>>>>>>>>> */
//Create Epic
export async function createEpic(data: CreateEpicPayload) {
  const response = await apiFetch("/rest/v1/epics", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(data),
  });

  return {
    ok: response.ok,
    status: response.status,
    data: response.data,
  };
}

// Get Project Epics
export async function getProjectEpics(projectId: string, limit: number, offset: number) {
  const response = await apiFetch<ProjectEpic[]>(
    `/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`,
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
    projectEpics: response.data,
    totalCount,
  };
}

// Get Project Epic By ID
export async function getProjectEpicByID(projectId: string, epicId: string) {
  const response = await apiFetch<ProjectEpic[]>(
    `/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`,
    {
      method: "GET",
      requiresAuth: true,
    }
  );

  const epic = response.data[0];

  if (!epic) {
    throw new Error("Epic not found");
  }

  return epic;
}

// Update Epic
export async function updateEpic(projectId: string, epicId: string, payload: UpdateEpicPayload) {
  await apiFetch(`/rest/v1/epics?id=eq.${epicId}`, {
    method: "PATCH",
    requiresAuth: true,
    body: JSON.stringify(payload),
  });

  return getProjectEpicByID(projectId, epicId);
}

/* <<<<<<<<<<<<<<< TASKS >>>>>>>>>>>>>>>>> */

//Create Task
export async function createTask(payload: CreateTaskPayload) {
  return await apiFetch("/rest/v1/tasks", {
    method: "POST",
    requiresAuth: true,
    body: JSON.stringify(payload),
  });
}

// Get Tasks of Epic
export async function getEpicTasks(epicId: string) {
  const response = await apiFetch<TaskPayload[]>(`/rest/v1/project_tasks?epic_id=eq.${epicId}`, {
    method: "GET",
    requiresAuth: true,
  });

  return response.data;
}
