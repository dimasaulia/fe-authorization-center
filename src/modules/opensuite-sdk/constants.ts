/**
 * OpenSuite SDK - Constants
 * 
 * Single source of truth for all static values used across the SDK.
 * Cookie names, storage keys, API endpoints, and default configuration.
 */

// --- Cookie Names ---

export const COOKIES = {
  /** httpOnly cookie storing the Keycloak access token */
  AUTH_TOKEN: "opensuite_auth_token",
  /** httpOnly cookie storing the Keycloak refresh token */
  REFRESH_TOKEN: "opensuite_refresh_token",
} as const;

// --- Session/Local Storage Keys ---

export const STORAGE_KEYS = {
  /** sessionStorage: auth session marker (non-sensitive metadata) */
  AUTH_SESSION: "opensuite_auth_session",
  /** sessionStorage: cached access snapshot (permissions + menus) */
  ACCESS_SNAPSHOT: "opensuite_access_snapshot",
  /** sessionStorage: cached access token (JWT) */
  ACCESS_TOKEN: "opensuite_access_token",
} as const;

// --- Authorization Server Endpoints ---

export const AUTH_SERVER_ENDPOINTS = {
  /** POST - Login via Keycloak */
  LOGIN: "/api/v1/auth/login",
  /** POST - Refresh token */
  REFRESH: "/api/v1/auth/refresh",
  /** GET - JWKS public keys for token verification */
  JWKS: "/api/v1/auth/.well-known/jwks.json",
  /** GET - Access snapshot (menus + permissions) for a specific app */
  ACCESS: (appCode: string) => `/api/v1/auth/me/apps/${appCode}/access`,
  /** GET - Access token (JWT) for a specific app */
  ACCESS_TOKEN: (appCode: string) => `/api/v1/auth/me/apps/${appCode}/token`,
} as const;

// --- Internal Next.js API Routes ---

export const INTERNAL_API_ROUTES = {
  /** POST - Login (stores tokens in httpOnly cookies) */
  LOGIN: "/api/auth/login",
  /** POST - Logout (clears cookies) */
  LOGOUT: "/api/auth/logout",
  /** POST - Refresh auth tokens */
  REFRESH: "/api/auth/refresh",
  /** GET - Check session existence */
  SESSION: "/api/auth/session",
  /** GET - Fetch access snapshot (proxied with cookie token) */
  ACCESS: "/api/auth/access",
} as const;

// --- Default Configuration ---

export const DEFAULTS = {
  /** Default access token refresh interval (4 minutes) */
  ACCESS_REFRESH_INTERVAL_MS: 4 * 60 * 1000,
  /** Default login route */
  LOGIN_ROUTE: "/login",
  /** Default authenticated route */
  DEFAULT_ROUTE: "/dashboard",
  /** Seconds before expiry to trigger auth token refresh */
  AUTH_REFRESH_BUFFER_SECONDS: 60,
  /** Minimum refresh timeout in ms (fallback floor) */
  MIN_REFRESH_TIMEOUT_MS: 30_000,
  /** Token expiry buffer for isTokenExpired check (seconds) */
  TOKEN_EXPIRY_BUFFER_SECONDS: 30,
} as const;

// --- Cookie Options ---

export const COOKIE_OPTIONS = {
  /** Base options for auth cookies */
  base: {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  },
} as const;
