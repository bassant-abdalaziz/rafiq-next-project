"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProjectsState } from "@/components/dashboard/ui/projects-state";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { ProjectEpicCard } from "@/components/dashboard/ui/project-epic-card";
import { ProjectEpicsSkeleton } from "@/components/dashboard/ui/project-epics-skeleton";

import AddProjectIcon from "@/assets/icons/plus.svg";
import RetryIcon from "@/assets/icons/error.svg";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllProjectEpics } from "@/redux/slices/projectEpicsSlice";
import { getOffset } from "@/utils/helpers";
import { fetchProjectByID } from "@/redux/slices/projectsSlice";

const PROJECT_EPICS_LIMIT = 10;

export default function ProjectEpicsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const { projectEpics, totalCount, isLoading, isLoadingMore, error, loadMoreError, hasFetched } =
    useAppSelector((state) => state.projectEpics);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingMoreRef = useRef(false);

  const pageFromUrl = Number(searchParams.get("page") || 1);

  const page = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const currentOffset = getOffset(page, PROJECT_EPICS_LIMIT);
  const loadedUntil = currentOffset + projectEpics.length;
  const hasMore = loadedUntil < totalCount;

  // Fetch epics on initial load and whenever page or projectId changes
  useEffect(() => {
    if (!projectId) return;

    const offset = getOffset(page, PROJECT_EPICS_LIMIT);

    dispatch(
      fetchAllProjectEpics({
        projectId,
        limit: PROJECT_EPICS_LIMIT,
        offset,
        mode: "replace",
      })
    );
  }, [dispatch, projectId, page]);

  const handleRetry = () => {
    if (!projectId) return;

    dispatch(
      fetchAllProjectEpics({
        projectId,
        limit: PROJECT_EPICS_LIMIT,
        offset: getOffset(page, PROJECT_EPICS_LIMIT),
        mode: "replace",
      })
    );
  };

  //Get name of project
  const { isProjectFetched, fetchedProjectId, project } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (!projectId) return;

    const shouldFetchProject = !isProjectFetched || fetchedProjectId !== projectId;

    if (shouldFetchProject) {
      dispatch(fetchProjectByID({ projectId }));
    }
  }, [dispatch, projectId, isProjectFetched, fetchedProjectId]);

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

        if (!firstEntry.isIntersecting) return;
        if (isFetchingMoreRef.current) return;

        isFetchingMoreRef.current = true;

        dispatch(
          fetchAllProjectEpics({
            projectId,
            limit: PROJECT_EPICS_LIMIT,
            offset: loadedUntil,
            mode: "append",
          })
        ).finally(() => {
          isFetchingMoreRef.current = false;
        });
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    dispatch,
    projectId,
    hasFetched,
    isLoading,
    isLoadingMore,
    error,
    loadMoreError,
    hasMore,
    loadedUntil,
  ]);

  if (!hasFetched || isLoading) {
    return <ProjectEpicsSkeleton />;
  }

  if (error || loadMoreError) {
    return (
      <ProjectsState
        icon={<RetryIcon />}
        title="Something went wrong"
        description="We're having trouble retrieving your project epics right now. Please try again in a moment."
        btn={
          <Button type="button" variant="primary" className="px-6" onClick={handleRetry}>
            Retry Connection
          </Button>
        }
      />
    );
  }

  if (hasFetched && !projectEpics.length) {
    return (
      <ProjectsState
        icon={<Image src="/imags/empty-project.png" alt="empty-epics" width={200} height={200} />}
        title="No epics in this project yet."
        description="Break down your large project into manageable epics to track progress better and maintain architectural clarity."
        btn={
          <Link href={`/project/${projectId}/epics/new`}>
            <Button
              type="button"
              variant="primary"
              iconElement={<AddProjectIcon aria-hidden="true" />}
              className="px-6"
            >
              Create First Epic
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <PageHeader
          title="Project Epics"
          breadcrumbs={[
            { label: "Projects", href: "/project" },
            { label: project?.name ?? "Project" },
            { label: "Epics" },
          ]}
        />

        <div className="flex items-center gap-6">
          <Link href={`/project/${projectId}/epics/new`}>
            <Button
              type="button"
              variant="primary"
              iconElement={<AddProjectIcon aria-hidden="true" />}
              className="h-11 px-6 text-sm"
            >
              New Epic
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {projectEpics.map((epic) => (
          <ProjectEpicCard key={epic.id} epic={epic} />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-10 md:hidden" />

      {isLoadingMore && (
        <p className="mt-2 text-center text-sm font-bold text-slate md:hidden">...</p>
      )}

      <Pagination
        total={totalCount}
        visibleCount={projectEpics.length}
        page={page}
        limit={PROJECT_EPICS_LIMIT}
        pathname={pathname}
        searchParamsString={searchParamsString}
        itemLabel="epics"
      />

      <Link
        href={`/project/${projectId}/epics/new`}
        className="fixed bottom-24 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl text-white shadow-lg md:hidden"
        aria-label="Create new epic"
      >
        <AddProjectIcon />
      </Link>
    </div>
  );
}
