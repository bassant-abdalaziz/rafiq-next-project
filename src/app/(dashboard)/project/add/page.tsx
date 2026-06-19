import AddProjectIcon from "@/assets/icons/add-project.svg";
import InviteMemberIcon from "@/assets/icons/invite-member.svg";
import ProtipIcon from "@/assets/icons/pro-tip.svg";
import { ProjectForm } from "@/components/dashboard/forms/project-form";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { SectionHeader } from "@/components/dashboard/ui/section-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddProjectPage() {
  return (
    <div className="w-full ">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <PageHeader
          title="Add New Project"
          breadcrumbs={[{ label: "Projects", href: "/project" }, { label: "Add New Project" }]}
        />

        <Link href="/project/add">
          {" "}
          <Button
            type="button"
            variant="primary"
            iconElement={<InviteMemberIcon aria-hidden="true" />}
            className="px-6"
          >
            Invite Member
          </Button>
        </Link>
      </div>

      <section className="mx-auto w-full max-w-3xl overflow-hidden md:rounded-lg md:bg-white md:shadow-sm mt-8">
        <div className="border-b border-[#E4E8F1] px-0 md:py-8 md:px-8">
          <SectionHeader
            title="Initialize New Project"
            description="Define the scope and foundational details of your project."
            icon={<AddProjectIcon aria-hidden="true" />}
          />
        </div>

        <div className="px-0  py-8 md:px-8">
          <ProjectForm />
        </div>

        <div className="bg-surface-low px-6 py-5 md:px-8 flex items-center gap-1">
          <ProtipIcon aria-hidden="true" className="hidden md:block" />
          <p className="text-sm leading-5 text-slate">
            <span className="font-bold ">Pro Tip</span> You can invite project members and assign
            epics immediately after the initial creation process.
          </p>
        </div>
      </section>
    </div>
  );
}
