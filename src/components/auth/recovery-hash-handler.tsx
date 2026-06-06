"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RecoveryHashHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    const params = new URLSearchParams(hash.replace("#", ""));

    const type = params.get("type");
    const accessToken = params.get("access_token");

    if (type === "recovery" && accessToken) {
      router.replace(
        `/reset-password?access_token=${accessToken}`
      );
    }
  }, [router]);

  return null;
}