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
import { useEffect, useRef } from "react";
import { ProjectsSkeleton } from "@/components/dashboard/ui/projects-skeleton";
import RetryIcon from "@/assets/icons/error.svg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllProjects, setCurrentPage } from "@/redux/slices/projectsSlice";

export default function ProjectsPage() {
  const dispatch = useAppDispatch();

  const {
    projects,
    totalCount,
    isLoading,
    isLoadingMore,
    error,
    loadMoreError,
    currentPage,
    hasFetched,
  } = useAppSelector((state) => state.projects);

  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  //fetch projects on desktop
  useEffect(() => {
    dispatch(fetchAllProjects({ limit, offset, mode: "replace" }));
  }, [dispatch, offset]);

  //to apply infinite scroll by using IntersectionObserver >>> only on mobile
  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting) {
          dispatch(
            fetchAllProjects({
              limit,
              offset: projects.length,
              mode: "append",
            })
          );
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [dispatch, projects.length]);

  const handlePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // desktop loading
  if (!hasFetched || isLoading) {
    return <ProjectsSkeleton />;
  }

  if (error || loadMoreError) {
    return (
      <ProjectsState
        icon={<RetryIcon />}
        title="Something went wrong"
        description="We're having trouble retrieving your projects right now. Please try again in a moment."
        btn={
          <Button
            type="button"
            variant="primary"
            className="px-6"
            onClick={() => dispatch(fetchAllProjects({ limit, offset, mode: "replace" }))}
          >
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

      <div ref={loadMoreRef} className="h-10 md:hidden" />

      {/* mobile loading */}
      {isLoadingMore && (
        <p className="mt-2 text-center text-sm text-slate md:hidden font-bold">...</p>
      )}

      <Pagination
        total={totalCount}
        visibleCount={projects.length}
        page={currentPage}
        limit={limit}
        handlePage={handlePage}
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
