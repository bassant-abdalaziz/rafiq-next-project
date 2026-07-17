"use client";

import { InputHTMLAttributes } from "react";
import SearchIcon from "@/assets/icons/search-icon.svg";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> & {
  onChange?: (value: string) => void;
};

export function SearchInput({ placeholder, onChange, ...props }: SearchInputProps) {
  return (
    <div className="w-full md:w-70 relative h-12 ">
      <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate/50">
        <SearchIcon />
      </span>

      <input
        type="search"
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-full w-full rounded-sm border border-transparent bg-surface-highest pl-14 pr-4 text-sm font-medium text-navy outline-none transition placeholder:text-[#6B7280] focus:border-primary"
        {...props}
      />
    </div>
  );
}
