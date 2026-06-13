import { Breadcrumbs } from "./breadcrumbs";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
};

export function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <div>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold leading-10 tracking-[-0.8px] text-navy">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
