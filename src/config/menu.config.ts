/**
 * @deprecated Use `useMenus` from `@/modules/opensuite-sdk` for dynamic menus.
 * This file provides fallback/demo menu data and a utility to map SDK menus
 * to the internal AppMenuItem format.
 */

import { routes } from "@/config/routes.config";
import type { AppMenuItem } from "@/types/menu.type";
import type { MenuEntry } from "@/modules/opensuite-sdk";

/**
 * Fallback menu for when the SDK hasn't loaded yet or for demo purposes.
 */
export const fallbackMenu: AppMenuItem[] = [
  {
    label: "Overview",
    href: routes.dashboard,
    permission: "dashboard.view",
    code: "dashboard",
  },
  {
    label: "Users",
    href: routes.users,
    permission: "user.list",
    code: "users",
  },
  {
    label: "Authorization Center",
    href: routes.apps,
    permission: "authorization.apps.view",
    code: "apps",
  },
  {
    label: "Teams",
    href: routes.teams,
    permission: "authorization.teams.view",
    code: "teams",
  },
  {
    label: "Actions",
    href: routes.actions,
    permission: "authorization.actions.view",
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
