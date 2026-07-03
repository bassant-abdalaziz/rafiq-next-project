"use client";
import { ProjectsState } from "@/components/dashboard/ui/projects-state";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllProjectMembers } from "@/redux/slices/projectMembersSlice";
import { useEffect } from "react";
import RetryIcon from "@/assets/icons/error.svg";
import InviteMemberIcon from "@/assets/icons/invite-member.svg";
import CreateProjectIcon from "@/assets/icons/add-project-circle.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { useParams } from "next/navigation";
import { ProjectMembersSkeleton } from "@/components/dashboard/ui/project-members-skeleton";
import { ProjectMemberCard } from "@/components/dashboard/ui/project-member-card";

export default function ProjectMembersPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const dispatch = useAppDispatch();

  const { hasFetched, fetchedProjectId, projectMembers, isLoading, error } = useAppSelector(
    (state) => state.projectMembers
  );

  useEffect(() => {
    if (!projectId) return;

    const shouldFetch = !hasFetched || fetchedProjectId !== projectId;

    if (shouldFetch) {
      dispatch(fetchAllProjectMembers({ projectId }));
    }
  }, [dispatch, projectId, hasFetched, fetchedProjectId]);
  if (!hasFetched || isLoading) {
    return <ProjectMembersSkeleton />;
  }

  if (error) {
    return (
      <ProjectsState
        icon={<RetryIcon />}
        title="Something went wrong"
        description="We're having trouble retrieving your project members right now. Please try again in a moment."
        btn={
          <Button
            type="button"
            variant="primary"
            className="px-6"
            onClick={() => dispatch(fetchAllProjectMembers({ projectId }))}
          >
            Retry Connection
          </Button>
        }
      />
    );
  }

  //if list of members empty
  if (hasFetched && !projectMembers.length) {
    return (
      <ProjectsState
        icon={<Image src="/imags/empty-project.png" alt="empty-project" width={200} height={200} />}
        title="No Project Members"
        description="You don’t have any project members yet."
        btn={
          <Link href="/project/add">
            <Button
              type="button"
              variant="primary"
              iconElement={<CreateProjectIcon aria-hidden="true" />}
              className="px-6"
            >
              Invite New Member
            </Button>
          </Link>
        }
      />
    );
  }

  const membersTableHeaders = ["Member", "Role", "Actions"];

  return (
    <div className="w-full">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <PageHeader
          title="Project Members"
          breadcrumbs={[
            { label: "Projects", href: "/project" },
            { label: "Project Name" },
            { label: "Members" },
          ]}
        />

        <Link href="/project/add">
          <Button
            type="button"
            variant="primary"
            iconElement={<InviteMemberIcon aria-hidden="true" />}
            className="h-11 px-6 text-sm"
          >
            Invite Member
          </Button>
        </Link>
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="hidden rounded-sm bg-slate-lighter shadow-sm md:block">
          <div className="grid grid-cols-[1.6fr_0.8fr_0.4fr] border-b border-[#EEF1F7] px-8 py-5">
            {membersTableHeaders.map((header) => (
              <p
                key={header}
                className="text-[10px] font-bold uppercase tracking-[0.6px] text-slate-darker"
              >
                {header}
              </p>
            ))}
          </div>

          {projectMembers.map((member) => (
            <ProjectMemberCard key={member.member_id} member={member} />
          ))}
        </div>

        <div className="space-y-3 md:hidden">
          {projectMembers.map((member) => (
            <ProjectMemberCard key={member.member_id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
