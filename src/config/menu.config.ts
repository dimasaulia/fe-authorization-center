import { routes } from "@/config/routes.config";
import type { AppMenuItem } from "@/types/menu.type";

export const fallbackMenu: AppMenuItem[] = [
  {
    label: "Overview",
    href: routes.dashboard,
    permission: "dashboard.view",
  },
  {
    label: "Users",
    href: routes.users,
    permission: "user.list",
  },
  {
    label: "Authorization Center",
    href: routes.apps,
    permission: "authorization.apps.view",
  },
  {
    label: "Teams",
    href: routes.teams,
    permission: "authorization.teams.view",
  },
  {
    label: "Actions",
    href: routes.actions,
    permission: "authorization.actions.view",
  },
];
