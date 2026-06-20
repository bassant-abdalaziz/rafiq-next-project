import AddProjectIcon from "@/assets/icons/plus.svg";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { SectionHeader } from "@/components/dashboard/ui/section-header";
import { ReactNode } from "react";

type Breadcrumb = {
  label: string;
  href?: string;
};

type EpicFormLayoutProps = {
  pageTitle: string;
  breadcrumbs: Breadcrumb[];
  sectionTitle: string;
  sectionDescription: string;
  children: ReactNode;
};

export function EpicFormLayout({
  pageTitle,
  breadcrumbs,
  sectionTitle,
  sectionDescription,
  children,
}: EpicFormLayoutProps) {
  return (
    <div className="w-full">
      <div className="mb-8 hidden items-start justify-between gap-4 md:flex">
        <PageHeader title={pageTitle} breadcrumbs={breadcrumbs} />
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
      </section>
    </div>
  );
}