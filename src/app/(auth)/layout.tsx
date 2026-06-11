import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center md:px-4 md:py-10">
      <section className="w-full max-w-xl bg-white px-8 py-12 shadow-sm md:rounded-lg md:px-12">
        {children}
      </section>
    </main>
  );
}
