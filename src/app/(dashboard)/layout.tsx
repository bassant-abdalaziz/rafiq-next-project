import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell";
import type { LoginResponse } from "@/types/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  let user: LoginResponse["user"];

  try {
    user = await getCurrentUser();
  } catch {
    redirect("/login");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}