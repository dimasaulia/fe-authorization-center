"use client";

/**
 * OpenSuite SDK - Can Component
 * Conditionally renders children based on user permissions.
 * 
 * Usage:
 * ```tsx
 * <Can permission="app.users.read">
 *   <UserList />
 * </Can>
 * 
 * <Can permission="app.users.delete" fallback={<span>No access</span>}>
 *   <DeleteButton />
 * </Can>
 * 
 * <Can anyPermission={["app.users.update", "app.users.write"]}>
 *   <EditForm />
 * </Can>
 * ```
 */

import type { ReactNode } from "react";
import { useAuthorization } from "../provider";

type CanProps = {
  /** Single permission to check */
  permission?: string;
  /** User must have ANY of these permissions */
  anyPermission?: string[];
  /** User must have ALL of these permissions */
  allPermissions?: string[];
  /** Content to render when authorized */
  children: ReactNode;
  /** Content to render when NOT authorized */
  fallback?: ReactNode;
};

export function Can({
  permission,
  anyPermission,
  allPermissions,
  children,
  fallback = null,
}: CanProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    useAuthorization();

  let allowed = false;

  if (permission) {
    allowed = hasPermission(permission);
  } else if (anyPermission) {
    allowed = hasAnyPermission(anyPermission);
  } else if (allPermissions) {
    allowed = hasAllPermissions(allPermissions);
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
