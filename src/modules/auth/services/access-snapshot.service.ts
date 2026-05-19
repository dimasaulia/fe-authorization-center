export type Permission =
  | "dashboard.view"
  | "user.list"
  | "user.create"
  | "user.delete"
  | "settings.view"
  | "authorization.apps.view"
  | "authorization.teams.view"
  | "authorization.actions.view";

export type AccessSnapshot = {
  permissions: Permission[];
};

export const demoAccessSnapshot: AccessSnapshot = {
  permissions: [
    "dashboard.view",
    "user.list",
    "user.create",
    "authorization.apps.view",
    "authorization.teams.view",
    "authorization.actions.view",
  ],
};

export function canAccess(
  snapshot: AccessSnapshot,
  permission: Permission,
): boolean {
  return snapshot.permissions.includes(permission);
}
