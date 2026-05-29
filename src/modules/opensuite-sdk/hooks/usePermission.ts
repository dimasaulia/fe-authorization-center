"use client";

/**
 * OpenSuite SDK - Permission Hooks
 * 
 * Hooks for checking permissions in components.
 * 
 * Usage:
 * ```tsx
 * const canEdit = usePermission("app.users.update");
 * const canManage = useAnyPermission(["app.users.update", "app.users.delete"]);
 * ```
 */

import { useAuthorization } from "../provider";

/**
 * Check if the current user has a specific permission.
 */
export function usePermission(permission: string): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission(permission);
}

/**
 * Check if the current user has any of the given permissions.
 */
export function useAnyPermission(permissions: string[]): boolean {
  const { hasAnyPermission } = useAuthorization();
  return hasAnyPermission(permissions);
}

/**
 * Check if the current user has all of the given permissions.
 */
export function useAllPermissions(permissions: string[]): boolean {
  const { hasAllPermissions } = useAuthorization();
  return hasAllPermissions(permissions);
}

/**
 * Get the list of authorized menus for the current user.
 */
export function useMenus() {
  const { menus } = useAuthorization();
  return menus;
}

/**
 * Check if the current user can access a specific route path.
 */
export function useRouteAccess(path: string): boolean {
  const { menus, hasPermission } = useAuthorization();
  const menu = menus.find((m) => m.path === path);
  if (!menu) return false;
  return hasPermission(menu.required_permission);
}
