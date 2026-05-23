"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

type AuthCenterNavProps = {
  active: "apps" | "teams" | "actions" | "roles";
};

export function AuthCenterNav({ active }: AuthCenterNavProps) {
  const { t } = usePreferences();

  const items = [
    { key: "apps", label: t("authz.nav.apps"), href: routes.apps },
    { key: "teams", label: t("authz.nav.teams"), href: routes.teams },
    { key: "actions", label: t("authz.nav.actions"), href: routes.actions },
    { key: "roles", label: t("authz.nav.roles"), href: routes.roles },
  ] as const;

  return (
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-2">
      {items.map((item) => (
        <Link
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
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
    </nav>
  );
}
