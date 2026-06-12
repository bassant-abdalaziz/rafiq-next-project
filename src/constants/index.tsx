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

export const menuItems: MenuItem[] = [
  {
    label: "Projects",
    href: "/project",
    Icon: ProjectsIcon,
  },
  {
    label: "Project Epics",
    href: "/project/epics",
    Icon: ProjectsEpicsIcon,
  },
  {
    label: "Project Tasks",
    href: "/project/tasks",
    Icon: ProjectsTasksIcon,
  },
  {
    label: "Project Members",
    href: "/project/members",
    Icon: ProjectsMembersIcon,
  },
  {
    label: "Project Details",
    href: "/project/details",
    Icon: ProjectsDetailsIcon,
  },
];

export const mobileItems: MenuItem[] = [
  {
    label: "Projects",
    href: "/project",
    Icon: ProjectsIcon,
  },
  {
    label: "Epics",
    href: "/project/epics",
    Icon: ProjectsEpicsIcon,
  },
  {
    label: "Tasks",
    href: "/project/tasks",
    Icon: ProjectsTasksIcon,
  },
  {
    label: "Members",
    href: "/project/members",
    Icon: ProjectsMembersIcon,
  },
  {
    label: "Details",
    href: "/project/details",
    Icon: ProjectsDetailsIcon,
  },
];
