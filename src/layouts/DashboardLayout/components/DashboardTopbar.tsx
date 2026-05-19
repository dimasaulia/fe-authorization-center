"use client";

import Link from "next/link";

import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export function DashboardTopbar() {
  const { t } = usePreferences();

  return (
    <header className="flex h-[78px] shrink-0 items-center justify-between border-b border-[var(--dashboard-topbar-border)] bg-[image:var(--dashboard-topbar)] px-5 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] backdrop-blur-xl md:px-[34px]">
      <div className="flex h-[42px] w-full max-w-[360px] items-center gap-2 rounded-[13px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-[var(--dashboard-subtle)]">
        <AppIcon className="h-4 w-4" name="search" />
        <span className="truncate text-sm leading-[18px]">
          {t("dashboard.search")}
        </span>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden sm:block">
          <LanguageToggle />
        </div>
        <ThemeToggle />
        <Link
          className="inline-flex h-10 min-w-[74px] items-center justify-center rounded-full border border-hero-border bg-hero px-[18px] text-sm font-semibold text-hero-foreground shadow-[0_10px_22px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover"
          href="/login"
        >
          {t("dashboard.login")}
        </Link>
      </div>
    </header>
  );
}
