/**
 * OpenSuite SDK - Token Storage
 * 
 * Auth tokens (access + refresh) are stored in secure httpOnly cookies
 * via Next.js API routes (server-side only, not accessible from JS).
 * 
 * Authorization/access tokens are stored in sessionStorage for dynamic
 * rendering purposes. They are re-fetched on hard reload and refreshed
 * periodically.
 */

import { STORAGE_KEYS } from "./constants";

// --- Session Storage (Authorization/Access - client-side) ---

export interface StoredAccessData {
  permissions: string[];
  menus: Array<{
    code: string;
    path: string;
    required_permission: string;
  }>;
  fetchedAt: number;
}

export interface StoredAccessToken {
  token: string;
  expiresIn: number;
  fetchedAt: number;
}

/**
 * Store the access snapshot (permissions + menus) in sessionStorage.
 */
export function storeAccessSnapshot(data: StoredAccessData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_SNAPSHOT, JSON.stringify(data));
}

/**
 * Retrieve the access snapshot from sessionStorage.
 */
export function getStoredAccessSnapshot(): StoredAccessData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.ACCESS_SNAPSHOT);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAccessData;
  } catch {
    return null;
  }
}

/**
 * Store the access token (JWT) in sessionStorage.
 */
export function storeAccessToken(data: StoredAccessToken): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, JSON.stringify(data));
}

/**
 * Retrieve the access token from sessionStorage.
 */
export function getStoredAccessToken(): StoredAccessToken | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAccessToken;
  } catch {
    return null;
  }
}

/**
 * Clear all authorization data from sessionStorage.
 */
export function clearAccessStorage(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_SNAPSHOT);
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

// --- Auth Session Marker (minimal client-side indicator) ---

/**
 * Store a minimal session indicator (non-sensitive) so the client
 * knows a session exists without exposing actual tokens.
 */
export function storeAuthSession(data: {
  expiresAt: number;
  sessionState: string;
}): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(data));
}

/**
 * Get the auth session indicator.
 */
export function getAuthSession(): {
  expiresAt: number;
  sessionState: string;
} | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Clear the auth session indicator.
 */
export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
}

/**
 * Clear everything (logout).
 */
export function clearAllStorage(): void {
  clearAccessStorage();
  clearAuthSession();
}
