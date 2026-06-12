import type { ReactNode } from "react";
import { getCurrentUser } from "@/actions/auth";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  const userName = user.user_metadata?.name || "User";
  const jobTitle = user.user_metadata?.department || "Frontend";


  return (
    <DashboardShell userName={userName} jobTitle={jobTitle}>
      {children}
    </DashboardShell>
  );
}
