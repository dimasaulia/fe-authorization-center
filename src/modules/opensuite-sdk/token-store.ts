/**
 * OpenSuite SDK - Token Store (in-memory singleton)
 * 
 * Stores the access token in memory for use by apiClient.
 * This is NOT in sessionStorage/localStorage - it lives only in JS memory.
 * On page refresh, the token is re-obtained from the refresh flow.
 * 
 * This singleton allows non-React code (like apiClient) to access
 * the current auth token without needing hooks or context.
 */

let _accessToken: string | null = null;
let _onTokenExpired: (() => Promise<void>) | null = null;

/**
 * Set the current access token (called by the provider after login/refresh).
 */
export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

/**
 * Get the current access token for use in API requests.
 * Returns null if not authenticated.
 */
export function getAccessToken(): string | null {
  return _accessToken;
}

/**
 * Register a callback to be called when a 401 is received (token expired).
 * The provider registers this to trigger a refresh flow.
 */
export function onTokenExpired(callback: () => Promise<void>): void {
  _onTokenExpired = callback;
}

/**
 * Trigger the token expired handler (called by apiClient on 401).
 */
export async function handleTokenExpired(): Promise<void> {
  if (_onTokenExpired) {
    await _onTokenExpired();
  }
}

/**
 * Clear the token store (called on logout).
 */
export function clearTokenStore(): void {
  _accessToken = null;
}
