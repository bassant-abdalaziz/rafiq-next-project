"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import ListViewIcon from "@/assets/icons/list-icon.svg";
import BoardViewIcon from "@/assets/icons/board-icon.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down-icon.svg";
import { TaskView } from "@/types/project";

type ViewSwitcherProps = {
  view: TaskView;
};

const VIEW_OPTIONS: { value: TaskView; label: string }[] = [
  {
    value: "list",
    label: "List View",
  },
  {
    value: "board",
    label: "Board View",
  },
];

function getViewIcon(view: TaskView) {
  return view === "board" ? <BoardViewIcon /> : <ListViewIcon />;
}

export function ViewSwitcher({ view }: ViewSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const currentOption = VIEW_OPTIONS.find((option) => option.value === view);

  const handleSelectView = (selectedView: TaskView) => {
    router.replace(`${pathname}?view=${selectedView}`, {
      scroll: false,
    });

    setIsOpen(false);
  };

  return (
    <div
      className="relative h-12 w-full md:w-45 hidden md:block"
      //close menu
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-full w-full items-center justify-between gap-4 rounded-md border border-[#EEF1F7] bg-white px-6 text-navy shadow-sm transition hover:border-primary/40"
      >
        <span className="flex items-center gap-3 text-sm font-bold ">
          <span className="text-primary">{getViewIcon(view)}</span>
          {currentOption?.label ?? "Board View"}
        </span>

        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-full overflow-hidden rounded-md border border-[#EEF1F7] bg-white shadow-lg">
          {VIEW_OPTIONS.map((option) => {
            const isActive = option.value === view;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectView(option.value)}
                className={`
                  flex h-12 w-full items-center gap-3 px-5 text-left text-sm font-bold transition
                  ${isActive ? "bg-light-navy text-primary" : "text-navy hover:bg-[#F4F7FF]"}
                `}
              >
                <span>{getViewIcon(option.value)}</span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
