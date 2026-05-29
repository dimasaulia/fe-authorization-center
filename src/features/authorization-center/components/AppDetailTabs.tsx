"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { usePermission } from "@/modules/opensuite-sdk";

type AppDetailTabsProps = {
  active: "overview" | "credentials" | "modules" | "permissions" | "menus" | "roles" | "role-permissions" | "settings";
  appId: string;
};

export function AppDetailTabs({ active, appId }: AppDetailTabsProps) {
  const { t } = usePreferences();

  const canViewModules = usePermission("authorization-center.modules.read");
  const canViewPermissions = usePermission("authorization-center.permission.read");
  const canViewMenus = usePermission("authorization-center.menu-and-routes.read");
  const canViewRoles = usePermission("authorization-center.roles.read");
  const canViewRolePermissions = usePermission("authorization-center.roles-and-permission.read");

  const items = [
    { key: "overview", label: t("authz.appDetail.tabs.overview"), href: routes.appDetail(appId), visible: true },
    { key: "credentials", label: t("authz.appDetail.tabs.credentials"), href: routes.appCredentials(appId), visible: false, disabled: true },
    { key: "modules", label: t("authz.appDetail.tabs.modules"), href: routes.appModules(appId), visible: canViewModules },
    { key: "permissions", label: t("authz.appDetail.tabs.permissions"), href: routes.appPermissions(appId), visible: canViewPermissions },
    { key: "menus", label: t("authz.appDetail.tabs.menus"), href: routes.appMenus(appId), visible: canViewMenus },
    { key: "roles", label: t("authz.appDetail.tabs.roles"), href: routes.appRoles(appId), visible: canViewRoles },
    { key: "role-permissions", label: t("authz.appDetail.tabs.rolePermissions"), href: routes.appRolePermissions(appId), visible: canViewRolePermissions },
    { key: "settings", label: t("authz.appDetail.tabs.settings"), href: routes.appDetail(appId), visible: true },
  ] as const;

  return (
    <aside className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-2 lg:w-64">
      <div className="grid gap-1">
        {items.map((item) => {
          if (!item.visible) return null;

          if ("disabled" in item && item.disabled) {
            return (
              <span
                className="cursor-not-allowed rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[var(--dashboard-subtle)] opacity-60"
                key={item.key}
              >
                {item.label} · {t("authz.appDetail.tabs.comingSoon")}
              </span>
            );
          }

          return (
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
          );
        })}
      </div>
    </aside>
  );
}
