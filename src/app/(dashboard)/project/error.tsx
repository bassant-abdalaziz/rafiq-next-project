"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProjectsState } from "@/components/dashboard/ui/projects-state";
import RetryIcon from "@/assets/icons/error.svg";
import { Button } from "@/components/ui/button";

type ProjectsErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProjectsError({ error, reset }: ProjectsErrorProps) {
  const router = useRouter();

  useEffect(() => {
    const message = error.message.toLowerCase();

    const isAuthError =
      message.includes("unauthorized") ||
      message.includes("session expired") ||
      message.includes("jwt") ||
      message.includes("token");

    if (isAuthError) {
      router.replace("/login");
    }
  }, [error, router]);

  return (
    <ProjectsState
      icon={<RetryIcon />}
      title="Something went wrong"
      description="We're having trouble retrieving your projects right now. Please try again in a moment."
      btn={
        <Button type="button" variant="primary" className="px-6" onClick={() => reset()}>
          Retry Connection
        </Button>
      }
    />
  );
}
