import { getProjects } from "@/actions/project";
import { ProjectsState } from "@/components/dashboard/ui/projects-state";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import CreateProjectIcon from "@/assets/icons/add-project-circle.svg";
import AddProjectIcon from "@/assets/icons/plus.svg";
import { SectionHeader } from "@/components/dashboard/ui/section-header";
import { ProjectCard } from "@/components/dashboard/ui/project-card";
import { Pagination } from "@/components/dashboard/ui/pagination";

export default async function ProjectsPage() {
  const projects = await getProjects();

  if (!projects.length) {
    return (
      <ProjectsState
        icon={<Image src="/imags/empty-project.png" alt="empty-project" width={200} height={200} />}
        title="No Projects"
        description="You don’t have any projects yet. Start by defining your first architectural workspace to begin tracking tasks and epics."
        btn={
          <Link href="/project/add">
            <Button
              type="button"
              variant="primary"
              iconElement={<CreateProjectIcon aria-hidden="true" />}
              className="px-6"
            >
              Create New Project
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <SectionHeader title="Projects" description="Manage and curate your projects" />

        <Link href="/project/add">
          <Button
            type="button"
            variant="primary"
            iconElement={<AddProjectIcon aria-hidden="true" />}
            className="h-11 px-6 text-sm"
          >
            Create New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Pagination total={24} visibleCount={projects.length} />

      <Link
        href="/project/add"
        className="fixed bottom-24 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl text-white shadow-lg md:hidden"
        aria-label="Create new project"
      >
        <AddProjectIcon />
      </Link>
    </div>
  );
}
