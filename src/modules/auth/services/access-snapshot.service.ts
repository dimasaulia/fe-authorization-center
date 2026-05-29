/**
 * @deprecated Use types and functions from `@/modules/opensuite-sdk` directly.
 * This file is kept for backward compatibility.
 */

export type { AccessSnapshot, MenuEntry } from "@/modules/opensuite-sdk";

// Re-export Permission as a string type for backward compat
export type Permission = string;

// Legacy canAccess function - now delegates to SDK
export function canAccess(
  snapshot: { permissions: string[] },
  permission: string,
): boolean {
  return snapshot.permissions.includes(permission);
}

// Legacy demo snapshot - no longer used in production
export const demoAccessSnapshot = {
  permissions: [] as string[],
};
