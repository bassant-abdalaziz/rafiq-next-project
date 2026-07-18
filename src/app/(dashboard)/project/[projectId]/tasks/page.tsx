import { Suspense } from "react";
import TasksPageClient from "./tasks-page-client";
import { TaskView } from "@/types/project";

type ProjectTasksPageProps = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ view?: TaskView; taskId?: string }>;
};

export default async function ProjectTasksPage({ params, searchParams }: ProjectTasksPageProps) {
  const { projectId } = await params;
  const { view, taskId } = await searchParams;

  const currentView: TaskView = view === "list" ? "list" : "board";

  return (
    <Suspense
      fallback={
        <div className="w-full">
          <div className="mb-8 h-14 w-full animate-pulse rounded-md bg-light-navy md:ml-auto md:w-175" />
          <div className="h-96 animate-pulse rounded-lg bg-white" />
        </div>
      }
    >
      <TasksPageClient projectId={projectId} view={currentView} initialTaskId={taskId ?? null} />
    </Suspense>
  );
}
