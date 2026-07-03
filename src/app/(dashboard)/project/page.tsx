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
import { fetchAllProjects } from "@/redux/slices/projectsSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getOffset } from "@/utils/helpers";

const PROJECTS_LIMIT = 10;

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { projects, totalCount, isLoading, isLoadingMore, error, loadMoreError, hasFetched } =
    useAppSelector((state) => state.projects);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Get page number from URL params
  const pageFromUrl = Number(searchParams.get("page") || 1);

  const page = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const currentOffset = getOffset(page, PROJECTS_LIMIT);

  const loadedUntil = currentOffset + projects.length;
  const hasMore = loadedUntil < totalCount;

  // Fetch projects on initial load and whenever page changes from URL
  useEffect(() => {
    const offset = getOffset(page, PROJECTS_LIMIT);

    dispatch(
      fetchAllProjects({
        limit: PROJECTS_LIMIT,
        offset,
        mode: "replace",
      })
    );
  }, [dispatch, page]);

  const handleRetry = () => {
    dispatch(
      fetchAllProjects({
        limit: PROJECTS_LIMIT,
        offset: getOffset(page, PROJECTS_LIMIT),
        mode: "replace",
      })
    );
  };

  // Apply infinite scroll by using IntersectionObserver >>> only on mobile
  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;
    if (!hasFetched) return;
    if (isLoading || isLoadingMore) return;
    if (error || loadMoreError) return;
    if (!hasMore) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry.isIntersecting) {
          dispatch(
            fetchAllProjects({
              limit: PROJECTS_LIMIT,
              offset: loadedUntil,
              mode: "append",
            })
          );
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [dispatch, hasFetched, isLoading, isLoadingMore, error, loadMoreError, hasMore, loadedUntil]);

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
          <Button type="button" variant="primary" className="px-6" onClick={handleRetry}>
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
        <p className="mt-2 text-center text-sm font-bold text-slate md:hidden">...</p>
      )}

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
