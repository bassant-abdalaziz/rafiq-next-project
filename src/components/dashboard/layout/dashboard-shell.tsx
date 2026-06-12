"use client";

import { ReactNode, useEffect, useState } from "react";
import { BottomMobileNavbar } from "./bottom-mobile-navbar";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { LoginResponse } from "@/types/auth";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";

type DashboardShellProps = {
  children: ReactNode;
  user: LoginResponse["user"];
};

export function DashboardShell({ children, user }: DashboardShellProps) {
  const dispatch = useAppDispatch();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);

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
          <Navbar onOpenMenu={() => setIsMobileMenuOpen(true)} />

          <main className="flex-1 px-5 py-6 pb-24 md:px-8 md:pb-8">{children}</main>
        </div>
      </div>

      <BottomMobileNavbar />
    </div>
  );
}
