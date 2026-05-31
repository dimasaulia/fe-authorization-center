"use client";

import { usePreferences } from "@/modules/preferences";
import { useAuth } from "@/modules/opensuite-sdk";
import { AppIcon } from "@/shared/components/AppIcon";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

type DashboardTopbarProps = {
  onLogout: () => void;
  onMenuOpen: () => void;
};

export function DashboardTopbar({ onLogout, onMenuOpen }: DashboardTopbarProps) {
  const { t } = usePreferences();
  const { isAuthenticated } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--dashboard-topbar-border)] bg-[image:var(--dashboard-topbar)] px-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] backdrop-blur-xl md:h-[78px] md:px-[34px]">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          aria-label="Open sidebar"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)] lg:hidden"
          onClick={onMenuOpen}
          type="button"
        >
          <AppIcon className="h-5 w-5" name="menu" />
        </button>
        <div className="hidden h-10 min-w-0 max-w-[360px] flex-1 items-center gap-2 rounded-[13px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3 text-[var(--dashboard-subtle)] sm:flex md:h-[42px] md:px-3.5">
          <AppIcon className="h-4 w-4" name="search" />
          <span className="truncate text-sm leading-[18px]">
            {t("dashboard.search")}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <div className="hidden lg:block">
          <LanguageToggle />
        </div>
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
        {isAuthenticated ? (
          <button
            className="inline-flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] text-sm font-semibold text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)] sm:w-auto sm:min-w-[74px] sm:px-[18px]"
            onClick={onLogout}
            type="button"
          >
            <AppIcon className="h-4 w-4" name="logout" />
            <span className="hidden sm:inline">{t("dashboard.logout")}</span>
          </button>
        ) : (
          <a
            className="inline-flex h-10 min-w-[62px] items-center justify-center rounded-full border border-hero-border bg-hero px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover sm:min-w-[74px] sm:px-[18px]"
            href="/login"
          >
            {t("dashboard.login")}
          </a>
        )}
      </div>
    </header>
  );
}
