import { Project } from "@/types/project";
import { formatProjectDate } from "@/utils/helpers";
import CalenderIcon from "@/assets/icons/calender.svg";
import Link from "next/link";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-sm bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex justify-between gap-4">
        <Link href={`/project/${project.id}/epics`} className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-navy">{project.name}</h3>
          <p className="mt-4 text-sm leading-6 text-slate">{project.description}</p>
        </Link>

        <Link
          href={`/project/${project.id}/edit`}
          className="text-xl"
          aria-label="Edit project"
        >
          📝
        </Link>
      </div>

      <Link
        href={`/project/${project.id}/epics`}
        className="mt-8 flex items-center gap-2 border-t border-[#EEF1F7] pt-4 md:justify-between"
      >
        <p className="hidden text-[10px] font-bold uppercase tracking-[0.6px] text-slate-dark md:block">
          Created At
        </p>

        <CalenderIcon className="block md:hidden" />

        <p className="text-sm text-slate-darker">{formatProjectDate(project.created_at)}</p>
      </Link>
    </div>
  );
}
