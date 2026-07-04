import { CreateTaskPageClient } from "./create-task-page-client";

type CreateTaskPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    epicId?: string;
  }>;
};

export default async function CreateTaskPage({ params, searchParams }: CreateTaskPageProps) {
  const { projectId } = await params;
  const { epicId } = await searchParams;

  return <CreateTaskPageClient projectId={projectId} initialEpicId={epicId ?? ""} />;
}