/**
 * OpenSuite SDK - Token Utilities
 * Decode JWT tokens without verification (for client-side payload reading).
 */

import { DEFAULTS } from "./constants";
import type { TokenPayload } from "./types";

/**
 * Decode a JWT payload without verification.
 * Used client-side to read user info from the id_token.
 * NEVER use this for security validation - always verify on server.
 */
export function decodeJwtPayload(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired based on its exp claim.
 * Returns true if expired or if token cannot be decoded.
 * Includes a buffer to account for clock skew.
 */
export function isTokenExpired(
  token: string,
  bufferSeconds = DEFAULTS.TOKEN_EXPIRY_BUFFER_SECONDS,
): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;

  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp - bufferSeconds;
}
