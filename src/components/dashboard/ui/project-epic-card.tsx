import { ProjectEpic } from "@/types/project";
import { formatProjectDate, getAvatarInitials } from "@/utils/helpers";

type ProjectEpicCardProps = {
  epic: ProjectEpic;
};

export function ProjectEpicCard({ epic }: ProjectEpicCardProps) {
  const displayDate = formatProjectDate(epic.deadline ?? epic.created_at);

  return (
    <article className="relative overflow-hidden rounded-sm bg-white p-5 shadow-sm">
      <div className="absolute left-0 top-0 h-full w-1 bg-darker-success" />

      <div className="flex items-start justify-between gap-4">
        <span className="rounded-sm bg-success px-3 py-1 text-[10px] font-bold text-darker-success">
          {epic.epic_id}
        </span>

        <button type="button" className="text-xl leading-none text-slate" aria-label="Epic actions">
          ...
        </button>
      </div>

      <h3 className="mt-5 text-lg font-bold leading-snug text-navy md:text-xl">{epic.title}</h3>

      <div className="mt-5 flex items-end justify-between gap-4">
        {epic.assignee?.name && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-light-success text-sm font-bold ">
              {getAvatarInitials(epic.assignee?.name)}
            </div>

            <div>
              <p className="text-xs text-slate">Assignee</p>
              <p className="text-sm font-bold text-navy">{epic.assignee?.name}</p>
            </div>
          </div>
        )}

        <div className="text-right md:hidden">
          <p className="text-[9px] font-bold uppercase text-slate">Deadline</p>
          <p className="text-xs font-bold text-navy">{displayDate}</p>
        </div>
      </div>

      <div className="mt-6 hidden items-center justify-between border-t border-[#EEF1F7] pt-4 text-xs text-slate md:flex">
        <p>
          Created by: <span className="font-bold text-navy">{epic.created_by?.name}</span>
        </p>

        <p>{displayDate}</p>
      </div>
    </article>
  );
}
