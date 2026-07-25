
import { ReactNode } from "react";

type TaskCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
};

export function TaskCard({ title, value, icon }: TaskCardProps) {
  return (
    <div className="flex min-h-28 flex-1 items-center justify-between rounded-lg bg-white px-4 py-6">
      <div>
        <p className="text-xs font-bold tracking-[0.8px] text-slate/60">{title}</p>

        <p
          className={`mt-3 text-[30px] font-bold leading-none text-${title === "OVERDUE TASKS" ? "error" : "navy"} `}
        >
          {value}
        </p>
      </div>

      <div className={`flex h-14 w-14 items-center justify-center rounded-md `}>{icon}</div>
    </div>
  );
}
