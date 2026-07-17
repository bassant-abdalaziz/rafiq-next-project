"use client";

import { ReactNode, useEffect, useState } from "react";
import { BottomMobileNavbar } from "./bottom-mobile-navbar";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { useAppDispatch } from "@/redux/hooks";
import { fetchCurrentUser } from "@/redux/slices/userSlice";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div className="h-dvh overflow-hidden bg-background">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`
    flex h-full min-h-0 min-w-0 flex-col transition-all duration-300
    ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"}
  `}
      >
        <Navbar onOpenMenu={() => setIsMobileMenuOpen(true)} />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-5 py-6 pb-24 md:px-8 md:pb-8">
          {children}
        </main>
      </div>

      <BottomMobileNavbar />
    </div>
  );
}
