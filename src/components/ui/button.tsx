import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-primary to-primary-container text-white",
  secondary: "bg-surface-highest text-primary hover:bg-surface-low",
  ghost: "bg-transparent text-slate hover:bg-slate hover:text-white",
};

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={` rounded-lg md:rounded-xs py-4 md:py-3 font-semibold text-base transition disabled:cursor-not-allowed disabled:opacity-60 ${
        variantClasses[variant]
      }  ${fullWidth ? "w-full" : ""} `}
      {...props}
    >
      {isLoading ? (
        <span
          aria-label="Loading"
          className=" inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        children
      )}
    </button>
  );
}
