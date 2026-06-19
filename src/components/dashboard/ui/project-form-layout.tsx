import AddProjectIcon from "@/assets/icons/add-project.svg";
import InviteMemberIcon from "@/assets/icons/invite-member.svg";
import ProtipIcon from "@/assets/icons/pro-tip.svg";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { SectionHeader } from "@/components/dashboard/ui/section-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

type Breadcrumb = {
  label: string;
  href?: string;
};

type ProjectFormLayoutProps = {
  pageTitle: string;
  breadcrumbs: Breadcrumb[];
  sectionTitle: string;
  sectionDescription: string;
  children: ReactNode;
};

export function ProjectFormLayout({
  pageTitle,
  breadcrumbs,
  sectionTitle,
  sectionDescription,
  children,
}: ProjectFormLayoutProps) {
  return (
    <div className="w-full">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <PageHeader title={pageTitle} breadcrumbs={breadcrumbs} />

        <Link href="/project/add">
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

      <section className="mx-auto mt-8 w-full max-w-3xl overflow-hidden md:rounded-lg md:bg-white md:shadow-sm">
        <div className="border-b border-[#E4E8F1] px-0 md:px-8 md:py-8">
          <SectionHeader
            title={sectionTitle}
            description={sectionDescription}
            icon={<AddProjectIcon aria-hidden="true" />}
          />
        </div>

        <div className="px-0 py-8 md:px-8">{children}</div>

        <div className="flex items-center gap-1 bg-surface-low px-6 py-5 md:px-8">
          <ProtipIcon aria-hidden="true" className="hidden md:block" />

          <p className="text-sm leading-5 text-slate">
            <span className="font-bold">Pro Tip</span> You can invite project members and assign
            epics immediately after the initial creation process.
          </p>
        </div>
      </section>
    </div>
  );
}