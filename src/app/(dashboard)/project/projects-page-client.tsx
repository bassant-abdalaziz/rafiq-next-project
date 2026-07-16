"use client";

import { ProjectsState } from "@/components/dashboard/ui/projects-state";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import CreateProjectIcon from "@/assets/icons/add-project-circle.svg";
import AddProjectIcon from "@/assets/icons/plus.svg";
import { SectionHeader } from "@/components/dashboard/ui/section-header";
import { ProjectCard } from "@/components/dashboard/ui/project-card";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { ProjectsSkeleton } from "@/components/dashboard/ui/projects-skeleton";
import RetryIcon from "@/assets/icons/error.svg";
import { usePathname, useSearchParams } from "next/navigation";
import { getProjects } from "@/actions/project";
import { useCallback } from "react";
import { Project } from "@/types/project";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { InfiniteScrollTrigger } from "@/components/dashboard/ui/infinite-scroll-trigger";

const PROJECTS_LIMIT = 10;

export default function ProjectsPageClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get page number from URL params
  const pageFromUrl = Number(searchParams.get("page") || 1);

  const page = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const fetchProjects = useCallback(
    async ({ limit, offset }: { limit: number; offset: number }) => {
      const response = await getProjects(limit, offset);

      return {
        items: response.projects,
        totalCount: response.totalCount,
      };
    },
    []
  );

  const {
    items: projects,
    totalCount,
    isLoading,
    isLoadingMore,
    error,
    hasFetched,
    hasMore,
    fetchMore,
    retry,
  } = usePaginatedFetch<Project>({
    limit: PROJECTS_LIMIT,
    page,
    fetcher: fetchProjects,
  });

  // desktop loading
  if (!hasFetched || isLoading) {
    return <ProjectsSkeleton />;
  }

  if (error) {
    return (
      <ProjectsState
        icon={<RetryIcon />}
        title="Something went wrong"
        description="We're having trouble retrieving your projects right now. Please try again in a moment."
        btn={
          <Button type="button" variant="primary" className="px-6" onClick={retry}>
            Retry Connection
          </Button>
        }
      />
    );
  }

  //if list of projects empty
  if (hasFetched && !projects.length) {
    return (
      <ProjectsState
        icon={<Image src="/imags/empty-project.png" alt="empty-project" width={200} height={200} />}
        title="No Projects"
        description="You don’t have any projects yet. Start by defining your first architectural workspace to begin tracking tasks and epics."
        btn={
          <Link href="/project/add">
            <Button
              type="button"
              variant="primary"
              iconElement={<CreateProjectIcon aria-hidden="true" />}
              className="px-6"
            >
              Create New Project
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <SectionHeader title="Projects" description="Manage and curate your projects" />

        <Link href="/project/add">
          <Button
            type="button"
            variant="primary"
            iconElement={<AddProjectIcon aria-hidden="true" />}
            className="h-11 px-6 text-sm"
          >
            Create New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <InfiniteScrollTrigger
        canLoadMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={fetchMore}
      />

      <Pagination
        total={totalCount}
        visibleCount={projects.length}
        page={page}
        limit={PROJECTS_LIMIT}
        pathname={pathname}
        searchParamsString={searchParams.toString()}
      />

      <Link
        href="/project/add"
        className="fixed bottom-24 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl text-white shadow-lg md:hidden"
        aria-label="Create new project"
      >
        <AddProjectIcon />
      </Link>
    </div>
  );
}
