"use client";

/**
 * OpenSuite SDK - Route Guard Component
 * 
 * Protects routes by checking if the user has the required permission.
 * Redirects to login if not authenticated, or shows fallback if not authorized.
 * 
 * Usage:
 * ```tsx
 * <RouteGuard permission="app.users.read" redirectTo="/dashboard">
 *   <UserListPage />
 * </RouteGuard>
 * ```
 */

import { useEffect, type ReactNode } from "react";
import { useOpenSuite } from "../provider";
import { getOpenSuiteConfig } from "../config";

type RouteGuardProps = {
  /** Permission required to access this route */
  permission?: string;
  /** Any of these permissions grants access */
  anyPermission?: string[];
  /** Where to redirect if not authorized (default: login route from config) */
  redirectTo?: string;
  /** Content to show while loading */
  loading?: ReactNode;
  /** Content to show when not authorized (instead of redirect) */
  unauthorized?: ReactNode;
  children: ReactNode;
};

export function RouteGuard({
  permission,
  anyPermission,
  redirectTo,
  loading = null,
  unauthorized,
  children,
}: RouteGuardProps) {
  const { auth, authorization, hasPermission, hasAnyPermission } = useOpenSuite();
  const config = getOpenSuiteConfig();

  const isLoading = auth.isLoading || (auth.isAuthenticated && !authorization.isLoaded);

  // Determine if user has required permission
  let allowed = true;
  if (permission) {
    allowed = hasPermission(permission);
  } else if (anyPermission) {
    allowed = hasAnyPermission(anyPermission);
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      const loginRoute = redirectTo ?? config.loginRoute ?? "/login";
      window.location.assign(loginRoute);
    }
  }, [auth.isLoading, auth.isAuthenticated, redirectTo, config.loginRoute]);

  // Redirect if not authorized (and no unauthorized fallback provided)
  useEffect(() => {
    if (
      !isLoading &&
      auth.isAuthenticated &&
      authorization.isLoaded &&
      !allowed &&
      !unauthorized
    ) {
      const defaultRoute = config.defaultRoute ?? "/dashboard";
      window.location.assign(defaultRoute);
    }
  }, [isLoading, auth.isAuthenticated, authorization.isLoaded, allowed, unauthorized, config.defaultRoute]);

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!auth.isAuthenticated) {
    return <>{loading}</>;
  }

  if (!allowed) {
    if (unauthorized) {
      return <>{unauthorized}</>;
    }
    return <>{loading}</>;
  }

  return <>{children}</>;
}
