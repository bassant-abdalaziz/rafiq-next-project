import type { ReactNode } from "react";
import { getCurrentUser } from "@/actions/auth";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
