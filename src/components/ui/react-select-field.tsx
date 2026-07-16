"use client";

import ReactSelect, { SingleValue } from "react-select";

export type SelectOption = {
  value: string;
  label: string;
};

type ReactSelectFieldProps = {
  id: string;
  label: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  optionalText?: string;
  isLoading?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  onInputChange?: (value: string) => void;
  onMenuScrollToBottom?: () => void;
  noOptionsMessage?: string;
  loadingMessage?: string;
};

export function ReactSelectField({
  id,
  label,
  value,
  options,
  onChange,
  onBlur,
  placeholder = "Select...",
  error,
  optionalText,
  isLoading = false,
  isClearable = true,
  isSearchable = true,
  onInputChange,
  onMenuScrollToBottom,
  noOptionsMessage = "No options found",
  loadingMessage = "Loading...",
}: ReactSelectFieldProps) {
  const selectedOption = options.find((option) => option.value === value) ?? null;

  return (
    <div >
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="block text-[10px] font-bold uppercase tracking-[0.6px] text-slate"
        >
          {label}
        </label>

        {optionalText && <span className="text-xs font-medium text-slate/50">{optionalText}</span>}
      </div>

      <ReactSelect<SelectOption, false>
        instanceId={id}
        inputId={id}
        unstyled
        options={options}
        value={selectedOption}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isLoading={isLoading}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={(option: SingleValue<SelectOption>) => {
          onChange(option?.value ?? "");
        }}
        onInputChange={(inputValue, meta) => {
          if (meta.action === "input-change") {
            onInputChange?.(inputValue);
          }

          return inputValue;
        }}
        onMenuScrollToBottom={onMenuScrollToBottom}
        noOptionsMessage={() => (isLoading ? loadingMessage : noOptionsMessage)}
        loadingMessage={() => loadingMessage}
        classNames={{
          control: ({ isFocused }) =>
            [
              "h-11 rounded-sm border bg-white px-3 text-sm transition",
              "hover:border-primary/40",
              isFocused ? "border-primary ring-2 ring-primary/10" : "border-[#DDE3EE]",
              error ? "border-red-500 ring-red-500/10" : "",
            ].join(" "),
          valueContainer: () => "gap-2 py-2",
          placeholder: () => "text-slate/40",
          singleValue: () => "text-slate",
          input: () => "text-slate",
          indicatorsContainer: () => "gap-1",
          clearIndicator: () => "cursor-pointer text-slate/40 hover:text-slate",
          dropdownIndicator: () => "cursor-pointer text-slate/40 hover:text-slate",
          menu: () =>
            "z-50 mt-2 overflow-hidden rounded-xl border border-[#DDE3EE] bg-white shadow-lg",
          menuList: () => "max-h-60 overflow-y-auto py-1",
          option: ({ isFocused, isSelected }) =>
            [
              "cursor-pointer px-4 py-2 text-sm",
              isSelected ? "bg-primary text-white" : "text-slate",
              isFocused && !isSelected ? "bg-[#F4F7FB]" : "",
            ].join(" "),
          noOptionsMessage: () => "px-4 py-3 text-sm text-slate/50",
          loadingMessage: () => "px-4 py-3 text-sm text-slate/50",
        }}
      />

      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
