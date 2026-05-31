"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthorization, useAuth } from "@/modules/opensuite-sdk";
import { mapMenuEntriesToAppMenu } from "@/config/menu.config";
import { AppIcon, type AppIconName } from "@/shared/components/AppIcon";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menu: AppMenuItem[] =
    isLoaded && menus.length > 0 ? mapMenuEntriesToAppMenu(menus) : [];

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

  const renderNavigationItems = (mode: "desktop" | "mobile") => {
    if (!isLoaded) {
      return [1, 2, 3, 4, 5].map((i) => (
        <div
          className={
            mode === "desktop"
              ? "h-[38px] w-[38px] animate-pulse rounded-xl bg-[var(--dashboard-panel-subtle)]"
              : "h-11 animate-pulse rounded-xl bg-[var(--dashboard-panel-subtle)]"
          }
          key={i}
        />
      ));
    }

    return menu.map((item) => {
      const active = isMenuActive(item.href);
      const itemClassName =
        mode === "desktop"
          ? [
              "flex h-[38px] w-[38px] items-center justify-center rounded-xl transition",
              active
                ? "border border-[var(--dashboard-accent-soft-border)] bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]"
                : "text-[var(--dashboard-text)] hover:bg-[var(--dashboard-panel-subtle)]",
            ].join(" ")
          : [
              "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition",
              active
                ? "border border-[var(--dashboard-accent-soft-border)] bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]"
                : "text-[var(--dashboard-text)] hover:bg-[var(--dashboard-panel-subtle)]",
            ].join(" ");

      return (
        <Link
          aria-label={item.label}
          className={itemClassName}
          href={item.href}
          key={item.href}
          onClick={
            mode === "mobile" ? () => setIsMobileSidebarOpen(false) : undefined
          }
          title={item.label}
        >
          <AppIcon
            className="h-[18px] w-[18px] shrink-0"
            name={getMenuIcon(item)}
          />
          {mode === "mobile" ? (
            <span className="truncate">{item.label}</span>
          ) : null}
        </Link>
      );
    });
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
            {renderNavigationItems("desktop")}
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
        {isMobileSidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Close sidebar"
              className="absolute inset-0 bg-black/35"
              onClick={() => setIsMobileSidebarOpen(false)}
              type="button"
            />
            <aside className="relative flex h-full w-[min(320px,calc(100vw-48px))] flex-col overflow-y-auto border-r border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-4 py-4 shadow-[18px_0_48px_rgba(0,0,0,0.18)]">
              <div className="flex items-center justify-between">
                <Link
                  aria-label="Open Suite dashboard"
                  className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] text-[var(--dashboard-text)]"
                  href="/dashboard"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <AppIcon className="h-5 w-5" name="box" />
                </Link>
                <button
                  aria-label="Close sidebar"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)]"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  type="button"
                >
                  <AppIcon className="h-5 w-5" name="close" />
                </button>
              </div>

              <nav className="mt-5 flex flex-col gap-1.5">
                {renderNavigationItems("mobile")}
              </nav>

              <div className="mt-5 space-y-3 border-t border-[var(--dashboard-border-soft)] pt-4">
                <ThemeToggle />
                <LanguageToggle />
              </div>

              <div className="flex-1" />
              <div className="mt-5 border-t border-[var(--dashboard-border-soft)] pt-4">
                <UserProfileMenu onLogout={handleLogout} />
              </div>
            </aside>
          </div>
        ) : null}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <DashboardTopbar
            onLogout={handleLogout}
            onMenuOpen={() => setIsMobileSidebarOpen(true)}
          />
          <div className="min-h-0 flex-1 overflow-auto px-4 py-5 sm:px-5 md:px-[34px] md:py-[34px]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
