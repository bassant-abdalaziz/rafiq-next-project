import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  rightElement?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      rightElement,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className={`mb-1 block text-[11px] font-bold uppercase leading-[22.75px] tracking-[0.55px] ${
            hasError ? "text-error" : "text-slate"
          }`}
        >
          {label}
        </label>

        <div className="relative">
          <input
            id={id}
            ref={ref}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={`
              w-full
              rounded-lg md:rounded-sm
              px-4 py-4.5 md:py-3.5
              text-base font-normal
              outline-none transition
              placeholder:text-[#737685]
              ${rightElement ? "pr-12" : ""}
              ${
                hasError
                  ? "bg-[#FFDAD6] text-error focus:ring-2 focus:ring-red-100"
                  : "bg-surface-highest text-[#737685] focus:ring-2 focus:ring-primary/20"
              }
              ${className}
            `}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
              {rightElement}
            </div>
          )}
        </div>

        {hasError ? (
          <p id={`${id}-error`} className="mt-2 text-sm text-error">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${id}-helper`} className="mt-2 text-sm text-slate-light">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";