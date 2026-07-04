import { ProjectEpicsSkeleton } from "@/components/dashboard/ui/project-epics-skeleton";
import { Suspense } from "react";
import EpicsPageClient from "./epics-page-client";

export default function EpicsPage() {
  return (
    <Suspense fallback={<ProjectEpicsSkeleton />}>
      <EpicsPageClient />
    </Suspense>
  );
}
