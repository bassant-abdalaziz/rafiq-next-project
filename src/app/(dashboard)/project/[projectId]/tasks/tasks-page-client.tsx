"use client";

import { getAllProjectTasks } from "@/actions/project";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { SearchInput } from "@/components/dashboard/ui/search-input";
import { SectionHeader } from "@/components/dashboard/ui/section-header";
import { BoardView } from "@/components/dashboard/ui/tasks-view/board-view";
import { ListView } from "@/components/dashboard/ui/tasks-view/list-view";
import { MobileView } from "@/components/dashboard/ui/tasks-view/mobile-card-view";
import { ViewSwitcher } from "@/components/dashboard/ui/view-switcher";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProjectByID } from "@/redux/slices/projectSlice";
import { TaskPayload, TaskView } from "@/types/project";
import Link from "next/link";
import { useEffect, useState } from "react";

type TasksPageClientProps = {
  projectId: string;
  view: TaskView;
};

export default function TasksPageClient({ projectId, view }: TasksPageClientProps) {
  const isMobile = useIsMobile();
  const [tasks, setTasks] = useState<TaskPayload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { isProjectFetched, fetchedProjectId, project } = useAppSelector((state) => state.projects);

  const dispatch = useAppDispatch();
  // Get project name
  useEffect(() => {
    if (!projectId) return;

    const shouldFetchProject = !isProjectFetched || fetchedProjectId !== projectId;

    if (shouldFetchProject) {
      dispatch(fetchProjectByID({ projectId }));
    }
  }, [dispatch, projectId, isProjectFetched, fetchedProjectId]);

  //get all project tasks
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const response = await getAllProjectTasks(projectId);
        setTasks(response);
      } catch {

        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadTasks();
  }, [projectId]);

  return (
    <div className="w-full min-w-0">
      <div>
        <PageHeader
          breadcrumbs={[
            { label: "Projects", href: "/project" },
            { label: project?.name ?? "Project" },
            { label: "Tasks" },
          ]}
        />
        <SectionHeader title="Active Workboard" />
      </div>

      <div className=" mt-5 lg:mt-[-25] flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
        <SearchInput placeholder="Search tasks..." />
        <div className="md:hidden">
          <Link href={`/project/${projectId}/tasks/new`}>
            <Button type="button" variant="primary" className="w-full ">
              + Create Task
            </Button>
          </Link>
        </div>
        <ViewSwitcher view={view} />
      </div>

      {isMobile === null ? null : isMobile ? (
        <MobileView tasks={tasks} loading={isLoading} error={error} />
      ) : view === "board" ? (
        <BoardView projectId={projectId} />
      ) : (
        <ListView tasks={tasks} loading={isLoading} error={error} />
      )}
    </div>
  );
}
