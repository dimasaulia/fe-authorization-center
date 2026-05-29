/**
 * Menu configuration for the sidebar.
 * These are general navigation items shown in the DashboardLayout sidebar.
 * 
 * In production, menus come from the authorization server via the SDK.
 * This fallback is used when the SDK hasn't loaded yet or for demo purposes.
 */

import { routes } from "@/config/routes.config";
import type { AppMenuItem } from "@/types/menu.type";
import type { MenuEntry } from "@/modules/opensuite-sdk";

/**
 * Fallback menu for when the SDK hasn't loaded yet or for demo purposes.
 */
export const fallbackMenu: AppMenuItem[] = [
  {
    label: "Dashboard",
    href: routes.dashboard,
    permission: "dashboard.read",
    code: "dashboard",
  },
  {
    label: "Apps",
    href: routes.apps,
    permission: "apps.read",
    code: "apps",
  },
  {
    label: "Teams",
    href: routes.teams,
    permission: "teams.read",
    code: "teams",
  },
  {
    label: "Roles",
    href: routes.roles,
    permission: "roles.read",
    code: "roles",
  },
  {
    label: "Users",
    href: routes.users,
    permission: "users.read",
    code: "users",
  },
  {
    label: "Actions",
    href: routes.actions,
    permission: "actions.read",
    code: "actions",
  },
];

/**
 * Map SDK MenuEntry[] to internal AppMenuItem[] format.
 * Extracts a human-readable label from the menu code.
 */
export function mapMenuEntriesToAppMenu(entries: MenuEntry[]): AppMenuItem[] {
  return entries.map((entry) => ({
    label: formatMenuLabel(entry.code),
    href: entry.path,
    permission: entry.required_permission,
    code: entry.code,
  }));
}

/**
 * Extract a human-readable label from a menu code.
 * e.g. "authorization-center.dashboard.dashboard" -> "Dashboard"
 */
function formatMenuLabel(code: string): string {
  const parts = code.split(".");
  const lastPart = parts[parts.length - 1] ?? code;
  return lastPart
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
