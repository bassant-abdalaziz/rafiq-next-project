import { TaskStatus } from "@/types/project";
import { CreateTaskPageClient } from "./create-task-page-client";

type CreateTaskPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    epicId?: string;
    status?: TaskStatus;
  }>;
};

export default async function CreateTaskPage({ params, searchParams }: CreateTaskPageProps) {
  const { projectId } = await params;
  const { epicId ,status} = await searchParams;

  return <CreateTaskPageClient projectId={projectId} initialEpicId={epicId ?? ""} initialStatus={status}/>;
}