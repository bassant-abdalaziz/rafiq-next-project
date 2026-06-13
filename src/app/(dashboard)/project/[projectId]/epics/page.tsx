type ProjectEpicsPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectEpicsPage({ params }: ProjectEpicsPageProps) {
  const { projectId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Project Epics</h1>
      <p className="mt-2 text-slate">Project ID: {projectId}</p>
    </div>
  );
}
