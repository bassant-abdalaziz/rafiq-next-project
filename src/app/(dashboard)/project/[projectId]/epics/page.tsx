import { Button } from "@/components/ui/button";
import Link from "next/link";

import AddProjectIcon from "@/assets/icons/plus.svg";

type ProjectEpicsPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectEpicsPage({ params }: ProjectEpicsPageProps) {
  const { projectId } = await params;

  return (
    <div>
      <Link href={`/project/${projectId}/epics/new`}>
        <Button
          type="button"
          variant="primary"
          iconElement={<AddProjectIcon aria-hidden="true" />}
          className="px-6"
        >
          New Epic
        </Button>
      </Link>
    </div>
  );
}