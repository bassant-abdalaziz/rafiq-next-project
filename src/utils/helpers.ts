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