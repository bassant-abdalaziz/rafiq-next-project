"use client";

import { getMenuItems } from "@/constants";
import { getProjectIdFromPathname } from "@/utils/helpers";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import TasklyIcon from "@/assets/icons/taskly.svg";
import LogoutIcon from "@/assets/icons/log-out.svg";
import CollapseIcon from "@/assets/icons/collapse.svg";
import NotCollapseIcon from "@/assets/icons/not-collapse.svg";
import { logOut } from "@/actions/auth";
import { getErrorMessage } from "@/utils/helpers";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { clearUser } from "@/redux/slices/userSlice";

type SidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({
  isCollapsed,
  isMobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const projectId = getProjectIdFromPathname(pathname);
  const menuItems = getMenuItems(projectId);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const response = await logOut();
      if (response.ok && response.status === 204) {
        dispatch(clearUser());

        router.replace("/login");
      }
    } catch (error) {

      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-navy/40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen md:h-auto bg-surface-low transition-all duration-300
          md:static md:z-auto md:block
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          ${isMobileOpen ? "w-70 translate-x-0" : "w-70 -translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex h-full flex-col px-4 py-5">
          <div
            className="mb-8 flex items-center text-center
           gap-2 font-bold text-navy"
          >
            <TasklyIcon aria-hidden="true" />

            {!isCollapsed && <span>TASKLY</span>}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.Icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`
                    flex h-10 items-center gap-3 rounded-sm px-3 text-sm font-semibold transition
                    ${isActive ? "bg-white text-primary" : "text-slate hover:bg-white hover:text-primary "}
                    ${isCollapsed ? "md:justify-center md:px-0" : ""}
                  `}
                >
                  <Icon aria-hidden="true" className="shrink-0" />

                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#E4E8F1] pt-6">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden h-10 w-full items-center gap-3 rounded-sm px-3 text-sm font-semibold text-navy hover:bg-white md:flex"
            >
              <span>{isCollapsed ? <CollapseIcon /> : <NotCollapseIcon />} </span>
              {!isCollapsed && <span>Collapse</span>}
            </button>

            <button
              type="button"
              className={`
                mt-3 flex h-10 w-full items-center gap-3 rounded-sm px-3 text-sm font-semibold text-error hover:bg-white
                ${isCollapsed ? "md:justify-center md:px-0" : ""}
              `}
              onClick={() => handleLogout()}
            >
              <LogoutIcon aria-hidden="true" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
