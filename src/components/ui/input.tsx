import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  iconElement?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, iconElement, id, className = "", ...props }, ref) => {
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
            className={`
              w-full
              rounded-lg md:rounded-sm
              px-4 py-4.5 md:py-3.5
              text-base font-normal
              outline-none transition
              placeholder:text-slate-dark
              ${iconElement ? "pr-12" : ""}
              ${
                hasError
                  ? "bg-[#FFDAD6] text-error focus:ring-2 focus:ring-red-100"
                  : "bg-surface-highest text-slate-dark focus:ring-2 focus:ring-primary/20"
              }
              ${className}
            `}
            {...props}
          />

          {iconElement && (
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center">
              {iconElement}
            </div>
          )}
        </div>

        {helperText ? <p className="mt-2 text-sm text-slate-light">{helperText}</p> : null}

        {hasError && <p className="mt-2 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  optionalText?: string;
  count?: number;
  maxLength?: number;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, optionalText, count, maxLength, id, className = "", ...props },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        <div className="mb-1 flex items-center justify-between gap-4">
          <label
            htmlFor={id}
            className={`block text-[11px] font-bold uppercase leading-[22.75px] tracking-[0.55px] ${
              hasError ? "text-error" : "text-slate"
            }`}
          >
            {label}
          </label>

          {optionalText && <span className="text-xs text-slate-light">{optionalText}</span>}
        </div>

        <textarea
          id={id}
          ref={ref}
          aria-invalid={hasError}
          maxLength={maxLength}
          className={`
            w-full
            min-h-[120px] md:min-h-[145px]
            resize-none
            rounded-lg md:rounded-sm
            px-4 py-4
            text-base font-normal
            outline-none transition
            placeholder:text-slate-dark
            ${
              hasError
                ? "bg-[#FFDAD6] text-error focus:ring-2 focus:ring-red-100"
                : "bg-surface-highest text-slate-dark focus:ring-2 focus:ring-primary/20"
            }
            ${className}
          `}
          {...props}
        />

        <div className="mt-2 flex w-full items-start gap-4">
          <div className="min-w-0 flex-1">
            {helperText ? <p className="mt-2 text-sm text-slate-light">{helperText}</p> : null}

            {hasError && <p className="mt-2 text-sm text-error">{error}</p>}
          </div>

          {typeof count === "number" && typeof maxLength === "number" && (
            <p className="ml-auto shrink-0 text-xs text-slate">
              {count} / {maxLength} characters
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
