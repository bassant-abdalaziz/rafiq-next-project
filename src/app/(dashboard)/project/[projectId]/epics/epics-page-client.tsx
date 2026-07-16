"use client";

import { useCallback, useEffect, useState } from "react";
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
import { InfiniteScrollTrigger } from "@/components/dashboard/ui/infinite-scroll-trigger";

import AddProjectIcon from "@/assets/icons/plus.svg";
import RetryIcon from "@/assets/icons/error.svg";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearSelectedEpic,
  fetchProjectEpicByID,
  updateProjectEpic,
} from "@/redux/slices/projectEpicsSlice";
import { fetchProjectByID } from "@/redux/slices/projectSlice";
import { fetchAllProjectMembers } from "@/redux/slices/projectMembersSlice";

import { getProjectEpics } from "@/actions/project";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { ProjectEpic, UpdateEpicPayload } from "@/types/project";

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

  const { selectedEpic, selectedEpicLoading, selectedEpicError } = useAppSelector(
    (state) => state.projectEpics
  );

  const {
    projectMembers,
    hasFetched: hasMembersFetched,
    fetchedProjectId: fetchedMembersProjectId,
  } = useAppSelector((state) => state.projectMembers);

  const { isProjectFetched, fetchedProjectId, project } = useAppSelector((state) => state.projects);

  const pageFromUrl = Number(searchParams.get("page") || 1);
  const page = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const fetchProjectEpics = useCallback(
    async ({ limit, offset }: { limit: number; offset: number }) => {
      const response = await getProjectEpics(projectId, limit, offset);

      return {
        items: response.projectEpics,
        totalCount: response.totalCount,
      };
    },
    [projectId]
  );

  const {
    items: projectEpics,
    totalCount,
    isLoading,
    isLoadingMore,
    error,
    hasFetched,
    hasMore,
    fetchMore,
    updateItem,
    retry,
  } = usePaginatedFetch<ProjectEpic>({
    limit: PROJECT_EPICS_LIMIT,
    page,
    fetcher: fetchProjectEpics,
  });

  // Get project name
  useEffect(() => {
    if (!projectId) return;

    const shouldFetchProject = !isProjectFetched || fetchedProjectId !== projectId;

    if (shouldFetchProject) {
      dispatch(fetchProjectByID({ projectId }));
    }
  }, [dispatch, projectId, isProjectFetched, fetchedProjectId]);

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

    const updatedEpic = await dispatch(
      updateProjectEpic({
        projectId,
        epicId: selectedEpicId,
        payload,
      })
    ).unwrap();

    updateItem(
      (epic) => epic.id === updatedEpic.id,
      () => updatedEpic
    );
  };

  if (!hasFetched || isLoading) {
    return <ProjectEpicsSkeleton />;
  }

  if (error) {
    return (
      <ProjectsState
        icon={<RetryIcon />}
        title="Something went wrong"
        description="We're having trouble retrieving your project epics right now. Please try again in a moment."
        btn={
          <Button type="button" variant="primary" className="px-6" onClick={retry}>
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

      <InfiniteScrollTrigger
        canLoadMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={fetchMore}
      />

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
        projectId={projectId}
        onClose={handleCloseEpicModal}
        onRetry={handleRetryEpicDetails}
        onUpdate={handleUpdateEpic}
      />
    </div>
  );
}