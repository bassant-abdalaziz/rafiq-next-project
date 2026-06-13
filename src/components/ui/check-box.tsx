import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: string;
  error?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, error, className = "", ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center gap-3 text-sm text-slate-darker"
        >
          <input
            id={id}
            ref={ref}
            type="checkbox"
            aria-invalid={!!error}
            className={`h-4 w-4 cursor-pointer rounded border border-[#C3C6D6] accent-primary ${className}`}
            {...props}
          />

          {label}
        </label>

        {error && (
          <p className="mt-2 text-sm text-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";