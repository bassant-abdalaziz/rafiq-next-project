import type { SVGProps, ComponentType } from "react";

import ProjectsIcon from "@/assets/icons/projects.svg";
import ProjectsEpicsIcon from "@/assets/icons/projects-epics.svg";
import ProjectsTasksIcon from "@/assets/icons/projects-tasks.svg";
import ProjectsMembersIcon from "@/assets/icons/projects-members.svg";
import ProjectsDetailsIcon from "@/assets/icons/projects-details.svg";

type MenuItem = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

export function getMenuItems(projectId?: string | null): MenuItem[] {
  const baseItems: MenuItem[] = [
    {
      label: "Projects",
      href: "/project",
      Icon: ProjectsIcon,
    },
  ];

  if (!projectId) {
    return baseItems;
  }

  return [
    ...baseItems,
    {
      label: "Project Epics",
      href: `/project/${projectId}/epics`,
      Icon: ProjectsEpicsIcon,
    },
    {
      label: "Project Tasks",
      href: `/project/${projectId}/tasks`,
      Icon: ProjectsTasksIcon,
    },
    {
      label: "Project Members",
      href: `/project/${projectId}/members`,
      Icon: ProjectsMembersIcon,
    },
    {
      label: "Project Details",
      href: `/project/${projectId}/edit`,
      Icon: ProjectsDetailsIcon,
    },
  ];
}

export function getMobileItems(projectId?: string | null): MenuItem[] {
  const baseItems: MenuItem[] = [
    {
      label: "Projects",
      href: "/project",
      Icon: ProjectsIcon,
    },
  ];

  if (!projectId) {
    return baseItems;
  }

  return [
    ...baseItems,
    {
      label: "Epics",
      href: `/project/${projectId}/epics`,
      Icon: ProjectsEpicsIcon,
    },
    {
      label: "Tasks",
      href: `/project/${projectId}/tasks`,
      Icon: ProjectsTasksIcon,
    },
    {
      label: "Members",
      href: `/project/${projectId}/members`,
      Icon: ProjectsMembersIcon,
    },
    {
      label: "Details",
      href: `/project/${projectId}/edit`,
      Icon: ProjectsDetailsIcon,
    },
  ];
}
export function getProjectIdFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  // /project
  // segments = ["project"]

  // /project/add
  // segments = ["project", "add"]

  // /project/123/epics
  // segments = ["project", "123", "epics"]

  if (segments[0] !== "project") {
    return null;
  }

  const projectId = segments[1];

  if (!projectId || projectId === "add") {
    return null;
  }

  return projectId;
}


export const TASK_STATUS_OPTIONS = [
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
] as const;