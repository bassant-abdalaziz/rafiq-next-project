"use client";

import { mobileItems } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomMobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 grid h-16 grid-cols-5 border-t border-[#E4E8F1] bg-surface-low md:hidden">
      {mobileItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.Icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
              isActive ? "text-primary" : "text-slate"
            }`}
          >
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
