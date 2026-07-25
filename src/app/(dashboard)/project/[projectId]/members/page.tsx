"use client";
import { ProjectsState } from "@/components/dashboard/ui/projects-state";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllProjectMembers } from "@/redux/slices/projectMembersSlice";
import { useEffect, useState } from "react";
import RetryIcon from "@/assets/icons/error.svg";
import InviteMemberIcon from "@/assets/icons/invite-member.svg";
import CreateProjectIcon from "@/assets/icons/add-project-circle.svg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { useParams } from "next/navigation";
import { ProjectMembersSkeleton } from "@/components/dashboard/ui/project-members-skeleton";
import { ProjectMemberCard } from "@/components/dashboard/ui/project-member-card";
import { fetchProjectByID } from "@/redux/slices/projectSlice";
import { InviteMemberModal } from "@/components/dashboard/ui/invite-member-modal";
import { inviteProjectMember } from "@/actions/project";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/helpers";
import AddMemberIcon from "@/assets/icons/plus.svg";

export default function ProjectMembersPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { hasFetched, fetchedProjectId, projectMembers, isLoading, error } = useAppSelector(
    (state) => state.projectMembers
  );

  const {
    isProjectFetched,
    fetchedProjectId: fetchedProjectID,
    project,
  } = useAppSelector((state) => state.projects);

  useEffect(() => {
    if (!projectId) return;

    const shouldFetch = !hasFetched || fetchedProjectId !== projectId;

    if (shouldFetch) {
      dispatch(fetchAllProjectMembers({ projectId }));
    }
  }, [dispatch, projectId, hasFetched, fetchedProjectId]);

  // Get project name
  useEffect(() => {
    if (!projectId) return;

    const shouldFetchProject = !isProjectFetched || fetchedProjectID !== projectId;

    if (shouldFetchProject) {
      dispatch(fetchProjectByID({ projectId }));
    }
  }, [dispatch, projectId, isProjectFetched, fetchedProjectID]);

  if (!hasFetched || isLoading) {
    return <ProjectMembersSkeleton />;
  }

  const handleInviteMember = async (email: string) => {
    try {
      await inviteProjectMember({
        email,
        projectId,
      });

      toast.success("Invitation sent successfully");
    } catch (error) {
      const message = getErrorMessage(error);

      toast.error(message);

      throw error;
    }
  };

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
      <>
        {" "}
        <ProjectsState
          icon={
            <Image src="/imags/empty-project.png" alt="empty-project" width={200} height={200} />
          }
          title="No Project Members"
          description="You don’t have any project members yet."
          btn={
            <Button
              type="button"
              variant="primary"
              iconElement={<CreateProjectIcon aria-hidden="true" />}
              className="h-11 px-6 text-sm"
              onClick={() => setIsInviteModalOpen(true)}
            >
              Invite Member
            </Button>
          }
        />
        <InviteMemberModal
          isOpen={isInviteModalOpen}
          projectName={project?.name}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={handleInviteMember}
        />
      </>
    );
  }

  const membersTableHeaders = ["Member", "Role", "Actions"];

  return (
    <>
      <div className="w-full">
        <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
          <PageHeader
            title="Project Members"
            breadcrumbs={[
              { label: "Projects", href: "/project" },
              { label: project?.name ?? "Project" },
              { label: "Members" },
            ]}
          />

          <Button
            type="button"
            variant="primary"
            iconElement={<CreateProjectIcon aria-hidden="true" />}
            className="h-11 px-6 text-sm"
            onClick={() => setIsInviteModalOpen(true)}
          >
            Invite Member
          </Button>
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

      <div
        className="fixed bottom-24 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl text-white shadow-lg md:hidden"
        aria-label="Invite new member"
        onClick={() => setIsInviteModalOpen(true)}
      >
        <AddMemberIcon />
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        projectName={project?.name}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteMember}
      />
    </>
  );
}
