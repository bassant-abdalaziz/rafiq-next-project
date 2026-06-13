import Link from "next/link";

import CrumbArrowIcon from "@/assets/icons/arrow.svg";
type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.1px]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.label} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="text-slate hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-primary" : "text-slate"}>{item.label}</span>
            )}

            {!isLast && <CrumbArrowIcon />}
          </div>
        );
      })}
    </nav>
  );
}
