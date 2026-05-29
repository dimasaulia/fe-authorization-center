"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthorization, useAuth } from "@/modules/opensuite-sdk";
import { fallbackMenu, mapMenuEntriesToAppMenu } from "@/config/menu.config";
import { AppIcon, type AppIconName } from "@/shared/components/AppIcon";
import type { AppMenuItem } from "@/types/menu.type";

import { DashboardTopbar } from "./components/DashboardTopbar";
import { UserProfileMenu } from "./components/UserProfileMenu";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { menus, isLoaded } = useAuthorization();
  const { logout } = useAuth();
  const pathname = usePathname();

  // Use SDK menus if loaded, otherwise fallback
  const menu: AppMenuItem[] = isLoaded && menus.length > 0
    ? mapMenuEntriesToAppMenu(menus)
    : fallbackMenu;

  const getMenuIcon = (item: AppMenuItem): AppIconName => {
    const href = item.href;
    const code = item.code.toLowerCase();

    if (code.includes("dashboard") || href === "/dashboard") return "dashboard";
    if (code.includes("user") || href.includes("users")) return "people";
    if (code.includes("app") || href.includes("apps")) return "apps";
    if (code.includes("team") || href.includes("teams")) return "briefcase";
    if (code.includes("action") || href.includes("actions")) return "zap";
    if (code.includes("role") || href.includes("roles")) return "roles";
    if (code.includes("permission")) return "key";
    if (code.includes("menu")) return "menu";

    return "document";
  };

  const isMenuActive = (href: string): boolean => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    await logout();
    window.location.assign("/login");
  };

  return (
    <main className="h-dvh bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]">
      <div className="flex h-full overflow-hidden">
        <aside className="hidden h-full w-16 shrink-0 flex-col items-center gap-2.5 overflow-y-auto border-r border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-2.5 py-[18px] lg:flex">
          <Link
            aria-label="Open Suite dashboard"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] text-[var(--dashboard-text)]"
            href="/dashboard"
          >
            <AppIcon className="h-[18px] w-[18px]" name="box" />
          </Link>
          <div className="my-2 h-px w-[30px] bg-[var(--dashboard-border-soft)]" />
          <nav className="flex flex-col gap-2">
            {!isLoaded ? (
              // Loading skeleton while menus are being fetched
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    className="h-[38px] w-[38px] animate-pulse rounded-xl bg-[var(--dashboard-panel-subtle)]"
                    key={i}
                  />
                ))}
              </>
            ) : (
              menu.map((item) => {
                const active = isMenuActive(item.href);
                return (
                  <Link
                    aria-label={item.label}
                    className={[
                      "flex h-[38px] w-[38px] items-center justify-center rounded-xl transition",
                      active
                        ? "border border-[var(--dashboard-accent-soft-border)] bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]"
                        : "text-[var(--dashboard-text)] hover:bg-[var(--dashboard-panel-subtle)]",
                    ].join(" ")}
                    href={item.href}
                    key={item.href}
                    title={item.label}
                  >
                    <AppIcon
                      className="h-[18px] w-[18px]"
                      name={getMenuIcon(item)}
                    />
                  </Link>
                );
              })
            )}
          </nav>
          <div className="flex-1" />
          <Link
            aria-label="Settings"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)]"
            href="/dashboard"
          >
          </Link>
          <UserProfileMenu onLogout={handleLogout} />
        </aside>
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <DashboardTopbar onLogout={handleLogout} />
          <div className="min-h-0 flex-1 overflow-auto px-5 py-6 md:px-[34px] md:py-[34px]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
