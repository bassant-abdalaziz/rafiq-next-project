import { TASK_STATUS_OPTIONS } from "@/constants";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong";
}

export function getAvatarInitials(name?: string) {
  if (!name) return "U";

  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-primary text-white",
  "bg-light-navy text-primary",
  "bg-darker-success text-white",
  "bg-[#F3E8FF] text-[#7E22CE]",
  "bg-[#E0F2FE] text-[#0284C7]",
  "bg-[#FFF7CC] text-[#A16207]",
  "bg-[#E5E7EB] text-slate",
];

export function getAvatarColorClasses(name?: string | null) {
  const fallbackName = name || "Unassigned";

  let hash = 0;

  for (let index = 0; index < fallbackName.length; index++) {
    hash += fallbackName.charCodeAt(index);
  }

  const colorIndex = hash % AVATAR_COLORS.length;

  return AVATAR_COLORS[colorIndex];
}

export function formatProjectDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
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

export const getOffset = (page: number, limit: number) => {
  return (page - 1) * limit;
};

type TaskStatus = (typeof TASK_STATUS_OPTIONS)[number];

export const STATUS_COLORS: Record<TaskStatus, string> = {
  TO_DO: "bg-slate",
  IN_PROGRESS: "bg-primary",
  BLOCKED: "bg-error",
  IN_REVIEW: "bg-slate",
  READY_FOR_QA: "bg-primary",
  REOPENED: "bg-error",
  READY_FOR_PRODUCTION: "bg-primary",
  DONE: "bg-darker-success",
};

export const STATUS_BADGE_COLORS: Record<TaskStatus, string> = {
  TO_DO: "bg-light-navy text-slate",
  IN_PROGRESS: "bg-light-navy text-primary",
  BLOCKED: "bg-light-error text-error",
  IN_REVIEW: "bg-light-navy text-slate",
  READY_FOR_QA: "bg-light-navy text-primary",
  REOPENED: "bg-light-error text-error",
  READY_FOR_PRODUCTION: "bg-light-navy text-primary",
  DONE: "bg-success text-darker-success",
};



export function formatStatusLabel(status: TaskStatus) {
  if (status === "DONE") return "COMPLETED";
  if (status === "IN_REVIEW") return "REVIEW";
  if (status === "IN_PROGRESS") return "IN PROGRESS";
  if (status === "READY_FOR_QA") return "QA";
  if (status === "READY_FOR_PRODUCTION") return "PRODUCTION";

  return status.replaceAll("_", " ");
}