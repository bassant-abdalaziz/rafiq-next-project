
import { ReactNode } from "react";

type ProjectsStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  btn: ReactNode;
};

export function ProjectsState({ icon, title, description, btn }: ProjectsStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-180px)] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
       <div className="flex items-center justify-center"> {icon}</div>

        <h2 className="mt-6 text-[36px] font-semibold leading-10 text-navy">{title}</h2>

        <p className="mt-3 text-lg leading-7 text-slate-darker">{description}</p>

        <div className="mt-8 flex justify-center">{btn}</div>
      </div>
    </div>
  );
}
