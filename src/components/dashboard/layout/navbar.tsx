"use client";

import { getAvatarInitials } from "@/utils/helpers";
import BurgerIcon from "@/assets/icons/burger.svg";
import { useAppSelector } from "@/redux/hooks";

type NavbarProps = {
  onOpenMenu: () => void;
};

export function Navbar({ onOpenMenu }: NavbarProps) {
  const user = useAppSelector((state) => state.user.user);

  const userName = user?.user_metadata?.name;
  const jobTitle = user?.user_metadata?.department;

  return (
    <header className="flex  items-center justify-between border-b border-[#E4E8F1] bg-background px-6 py-3 h-18 md:justify-end ">
      <div className="flex items-center gap-1 md:hidden">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-md text-navy"
        >
          <BurgerIcon />
        </button>

        <div className="text-[20px] font-bold text-navy">TASKLY</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-sm font-semibold leading-4 text-navy">{userName}</p>
          {jobTitle && (
            <p className="text-[10px] font-bold uppercase tracking-[1px] text-primary">
              {jobTitle}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
          {getAvatarInitials(userName)}
        </div>
      </div>
    </header>
  );
}
