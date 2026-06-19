import type { Member } from "@/types/project";
import { getAvatarInitials } from "@/utils/helpers";

type ProjectMemberCardProps = {
  member: Member;
};

function getRoleClass(role: string) {
  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "owner") {
    return "bg-primary text-white";
  }

  if (normalizedRole === "admin") {
    return "bg-[#CDDDFF] text-[#51617E]";
  }

  if (normalizedRole === "member") {
    return "bg-surface-highest text-slate-darker";
  }

  if (normalizedRole === "viewer") {
    return "bg-slate-lighter text-slate-darker";
  }
}

export function ProjectMemberCard({ member }: ProjectMemberCardProps) {
  const name = member.metadata?.name;
  const email = member.metadata?.email;
  const role = member.role;
  const initials = getAvatarInitials(name);

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-sm bg-white p-4 shadow-sm md:grid-cols-[1.6fr_0.8fr_0.4fr] md:rounded-none md:border-b md:border-[#EEF1F7] md:px-8 md:py-5 md:shadow-none md:last:border-b-0">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#DCE8FF] text-sm font-bold text-primary">
          {initials}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-navy">{name}</h3>
          <p className="mt-1 truncate text-xs text-slate">{email}</p>
        </div>
      </div>

      <div className="flex justify-end md:justify-start">
        <span
          className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.4px] ${getRoleClass(
            role
          )}`}
        >
          {role}
        </span>
      </div>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-sm text-slate hover:bg-surface-low"
        aria-label="Member actions"
      >
        ⋮
      </button>
    </div>
  );
}
