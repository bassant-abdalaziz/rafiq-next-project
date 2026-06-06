import { Suspense } from "react";
import ResetPasswordContent from "./content-reset-password";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate">
          Loading...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}