import { Suspense } from "react";
import { ProjectsSkeleton } from "@/components/dashboard/ui/projects-skeleton";
import ProjectsPageClient from "./projects-page-client";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsPageClient />
    </Suspense>
  );
}
