"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProjectsState } from "@/components/dashboard/ui/projects-state";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { Pagination } from "@/components/dashboard/ui/pagination";
import { ProjectEpicCard } from "@/components/dashboard/ui/project-epic-card";
import { ProjectEpicsSkeleton } from "@/components/dashboard/ui/project-epics-skeleton";
import { EpicDetailsModal } from "@/components/dashboard/ui/epic-details-modal";

import AddProjectIcon from "@/assets/icons/plus.svg";
import RetryIcon from "@/assets/icons/error.svg";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearSelectedEpic,
  fetchAllProjectEpics,
  fetchProjectEpicByID,
  updateProjectEpic,
} from "@/redux/slices/projectEpicsSlice";
import { fetchProjectByID } from "@/redux/slices/projectsSlice";
import { fetchAllProjectMembers } from "@/redux/slices/projectMembersSlice";

import { getOffset } from "@/utils/helpers";
import { UpdateEpicPayload } from "@/types/project";
import { LoadingDots } from "@/components/dashboard/ui/loading-dots";



const PROJECT_EPICS_LIMIT = 10;

export default function EpicsPageClient() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);

  const {
    projectEpics,
    totalCount,
    isLoading,
    isLoadingMore,
    error,
    loadMoreError,
    hasFetched,
    selectedEpic,
    selectedEpicLoading,
    selectedEpicError,
  } = useAppSelector((state) => state.projectEpics);

  const {
    projectMembers,
    hasFetched: hasMembersFetched,
    fetchedProjectId: fetchedMembersProjectId,
  } = useAppSelector((state) => state.projectMembers);

  const { isProjectFetched, fetchedProjectId, project } = useAppSelector((state) => state.projects);

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

  // Get project name
  useEffect(() => {
    if (!projectId) return;

    const shouldFetchProject = !isProjectFetched || fetchedProjectId !== projectId;

    if (shouldFetchProject) {
      dispatch(fetchProjectByID({ projectId }));
    }
  }, [dispatch, projectId, isProjectFetched, fetchedProjectId]);

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

  const handleOpenEpic = (epicId: string) => {
    if (!projectId) return;

    setSelectedEpicId(epicId);
    setIsEpicModalOpen(true);

    dispatch(fetchProjectEpicByID({ projectId, epicId }));

    const shouldFetchMembers = !hasMembersFetched || fetchedMembersProjectId !== projectId;

    if (shouldFetchMembers) {
      dispatch(fetchAllProjectMembers({ projectId }));
    }
  };

  const handleCloseEpicModal = () => {
    setIsEpicModalOpen(false);
    setSelectedEpicId(null);
    dispatch(clearSelectedEpic());
  };

  const handleRetryEpicDetails = () => {
    if (!projectId || !selectedEpicId) return;

    dispatch(
      fetchProjectEpicByID({
        projectId,
        epicId: selectedEpicId,
      })
    );
  };

  const handleUpdateEpic = async (payload: UpdateEpicPayload) => {
    if (!projectId || !selectedEpicId) return;

    await dispatch(
      updateProjectEpic({
        projectId,
        epicId: selectedEpicId,
        payload,
      })
    ).unwrap();
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
          <ProjectEpicCard key={epic.id} epic={epic} onClick={() => handleOpenEpic(epic.id)} />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-10 md:hidden" />

      {isLoadingMore && <LoadingDots label="Loading more epics" className="mt-4 md:hidden" />}

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

      <EpicDetailsModal
        isOpen={isEpicModalOpen}
        epic={selectedEpic}
        isLoading={selectedEpicLoading}
        error={selectedEpicError}
        projectMembers={projectMembers}
        onClose={handleCloseEpicModal}
        onRetry={handleRetryEpicDetails}
        onUpdate={handleUpdateEpic}
      />
    </div>
  );
}
