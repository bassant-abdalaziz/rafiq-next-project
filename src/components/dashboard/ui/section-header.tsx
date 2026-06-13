import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
};

export function SectionHeader({ title, description, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center  gap-4">
      {icon && <div className="hidden md:block">{icon}</div>}

      <div>
        <h2 className="text-[24px] font-semibold   text-navy ">{title}</h2>

        {description && <p className="mt-1 text-sm  text-slate">{description}</p>}
      </div>
    </div>
  );
}
