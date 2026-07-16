"use client";
import { EpicFormLayout } from "@/components/dashboard/ui/epic-form-layout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { fetchAllProjectMembers } from "@/redux/slices/projectMembersSlice";
import { EpicForm } from "@/components/dashboard/forms/epic-form";
import { fetchProjectByID } from "@/redux/slices/projectSlice";

export default function CreateEpicPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const dispatch = useAppDispatch();
  const { projectMembers } = useAppSelector((state) => state.projectMembers);

  const { isProjectFetched, fetchedProjectId, project } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (!projectId) return;

    const shouldFetchProject = !isProjectFetched || fetchedProjectId !== projectId;

    if (shouldFetchProject) {
      dispatch(fetchProjectByID({ projectId }));
    }
  }, [dispatch, projectId, isProjectFetched, fetchedProjectId]);

  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchAllProjectMembers({ projectId }));
  }, [dispatch, projectId]);

  return (
    <EpicFormLayout
      pageTitle="Create New Epic"
      breadcrumbs={[
        { label: "Projects", href: "/project" },
        { label: project?.name ?? "Project" },
        { label: "Epics", href: `/project/${projectId}/epics` },
        { label: "New Epic" },
      ]}
      sectionTitle="Create New Epic"
      sectionDescription="Define a major project phase or high-level milestone to group related tasks and track architectural progress."
    >
      <EpicForm projectId={projectId} members={projectMembers} />
    </EpicFormLayout>
  );
}
