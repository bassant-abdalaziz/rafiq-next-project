import type { ReactNode } from "react";

type TextAlign = "left" | "center";

type ResponsiveAlign = {
  mobile?: TextAlign;
  desktop?: TextAlign;
};

type AuthFormLayoutProps = {
  title: string;
  subtitle: string;
  align?: TextAlign | ResponsiveAlign;
  children: ReactNode;
  footer?: ReactNode;
};

function getAlignClass(align: AuthFormLayoutProps["align"]) {
  if (!align) return "text-left";

  if (typeof align === "string") {
    return align === "center" ? "text-center" : "text-left";
  }

  const mobileAlign = align.mobile === "center" ? "text-center" : "text-left";
  const desktopAlign =
    align.desktop === "center" ? "md:text-center" : "md:text-left";

  return `${mobileAlign} ${desktopAlign}`;
}

export function AuthFormLayout({
  title,
  subtitle,
  align = "center",
  children,
  footer,
}: AuthFormLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center md:px-4 md:py-10">
      <section className="w-full max-w-xl bg-white px-8 py-12 shadow-sm md:rounded-lg md:px-12">
        <div className={getAlignClass(align)}>
          <p className="whitespace-nowrap text-[24px] font-semibold leading-10 tracking-[-0.8px] text-navy md:text-[30px] md:leading-9 md:tracking-[-0.75px]">
            {title}
          </p>

          <p className="mt-3 text-[14px] font-normal leading-[22.75px] text-slate md:leading-5">
            {subtitle}
          </p>
        </div>

        <div className="mt-10">{children}</div>

        {footer && (
          <div className="mt-10 text-center text-sm text-slate">
            {footer}
          </div>
        )}
      </section>
    </main>
  );
}