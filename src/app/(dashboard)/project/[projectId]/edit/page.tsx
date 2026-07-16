"use client";

import { ProjectForm } from "@/components/dashboard/forms/project-form";
import { ProjectFormLayout } from "@/components/dashboard/ui/project-form-layout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProjectByID } from "@/redux/slices/projectSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ProjectEditPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const dispatch = useAppDispatch();

  const { isProjectFetched, fetchedProjectId, project } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (!projectId) return;

    const shouldFetchProject = !isProjectFetched || fetchedProjectId !== projectId;

    if (shouldFetchProject) {
      dispatch(fetchProjectByID({ projectId }));
    }
  }, [dispatch, projectId, isProjectFetched, fetchedProjectId]);

  return (
    <ProjectFormLayout
      pageTitle="Edit Project"
      breadcrumbs={[{ label: "Projects", href: "/project" }, { label: "Edit Project" }]}
      sectionTitle="Edit Project"
      sectionDescription="Define the scope and foundational details of your project."
    >
      <ProjectForm type="edit" project={project} />
    </ProjectFormLayout>
  );
}
