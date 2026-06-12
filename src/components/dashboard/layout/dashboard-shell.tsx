"use client";

import { ReactNode, useState } from "react";
import { BottomMobileNavbar } from "./bottom-mobile-navbar";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

type DashboardShellProps = {
  children: ReactNode;
  userName: string;
  jobTitle?: string;
};

export function DashboardShell({
  children,
  userName,
  jobTitle,
}: DashboardShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background ">
      <div className="flex min-h-screen">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileMenuOpen}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar
            userName={userName}
            jobTitle={jobTitle}
            onOpenMenu={() => setIsMobileMenuOpen(true)}
          />

          <main className="flex-1 px-5 py-6 pb-24 md:px-8 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      <BottomMobileNavbar />
    </div>
  );
}