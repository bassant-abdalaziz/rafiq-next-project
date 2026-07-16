"use client";

import { useEffect } from "react";

import { EpicFormLayout } from "@/components/dashboard/ui/epic-form-layout";
import { TaskForm } from "@/components/dashboard/forms/task-form";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllProjectMembers } from "@/redux/slices/projectMembersSlice";
import { fetchProjectByID } from "@/redux/slices/projectSlice";

type CreateTaskPageClientProps = {
  projectId: string;
  initialEpicId?: string;
};

export function CreateTaskPageClient({ projectId, initialEpicId = "" }: CreateTaskPageClientProps) {
  const dispatch = useAppDispatch();

  const {
    projectMembers,
    hasFetched: hasMembersFetched,
    fetchedProjectId: fetchedMembersProjectId,
  } = useAppSelector((state) => state.projectMembers);

  const { isProjectFetched, fetchedProjectId, project } = useAppSelector((state) => state.projects);

  useEffect(() => {
    const shouldFetchProject = !isProjectFetched || fetchedProjectId !== projectId;

    if (shouldFetchProject) {
      dispatch(fetchProjectByID({ projectId }));
    }
  }, [dispatch, projectId, isProjectFetched, fetchedProjectId]);

  useEffect(() => {
    const shouldFetchMembers = !hasMembersFetched || fetchedMembersProjectId !== projectId;

    if (shouldFetchMembers) {
      dispatch(fetchAllProjectMembers({ projectId }));
    }
  }, [dispatch, projectId, hasMembersFetched, fetchedMembersProjectId]);

  return (
    <EpicFormLayout
      pageTitle="Create New Task"
      breadcrumbs={[
        { label: "Projects", href: "/project" },
        { label: project?.name ?? "Project" },
        { label: "Tasks", href: `/project/${projectId}/tasks` },
        { label: "New Task" },
      ]}
      sectionTitle="Create New Task"
      sectionDescription="Initialize a new work item within the Architectural Workspace ecosystem."
    >
      <TaskForm projectId={projectId} members={projectMembers} initialEpicId={initialEpicId} />
    </EpicFormLayout>
  );
}
