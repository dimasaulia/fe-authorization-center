"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

type AppDetailTabsProps = {
  active: "overview" | "credentials" | "settings";
  appId: string;
};

const disabledItems = [
  "Modules",
  "Menus & Routes",
  "Permissions",
  "Roles",
  "Users & Teams",
  "Audit",
];

export function AppDetailTabs({ active, appId }: AppDetailTabsProps) {
  const { t } = usePreferences();

  const items = [
    { key: "overview", label: t("authz.appDetail.tabs.overview"), href: routes.appDetail(appId) },
    { key: "credentials", label: t("authz.appDetail.tabs.credentials"), href: routes.appCredentials(appId) },
    { key: "settings", label: t("authz.appDetail.tabs.settings"), href: routes.appSettings(appId) },
  ] as const;

  return (
    <aside className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-2 lg:w-64">
      <div className="grid gap-1">
        {items.map((item) => (
          <Link
            className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
              active === item.key
                ? "bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]"
                : "text-[var(--dashboard-muted)] hover:bg-[var(--dashboard-panel-subtle)] hover:text-[var(--dashboard-text)]"
            }`}
            href={item.href}
            key={item.key}
          >
            {item.label}
          </Link>
        ))}
        {disabledItems.map((item) => (
          <span
            className="cursor-not-allowed rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[var(--dashboard-subtle)] opacity-60"
            key={item}
          >
            {item} · {t("authz.appDetail.tabs.comingSoon")}
          </span>
        ))}
      </div>
    </aside>
  );
}
