import { fallbackMenu } from "@/config/menu.config";
import {
  canAccess,
  demoAccessSnapshot,
} from "@/modules/auth/services/access-snapshot.service";

export function getAuthorizedMenu() {
  return fallbackMenu.filter((item) =>
    canAccess(demoAccessSnapshot, item.permission),
  );
}
