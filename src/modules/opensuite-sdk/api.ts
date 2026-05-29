/**
 * OpenSuite SDK - Auth API Client
 * Handles communication with the authorization server for authentication.
 */

import { getOpenSuiteConfig } from "./config";
import { AUTH_SERVER_ENDPOINTS } from "./constants";
import type {
  AuthResponse,
  AccessSnapshotResponse,
  AccessTokenResponse,
  JWKSResponse,
  UserProfileResponse,
} from "./types";

function getBaseUrl(): string {
  return getOpenSuiteConfig().authServerUrl;
}

function getAppCode(): string {
  return getOpenSuiteConfig().appCode;
}

/**
 * Login with username/password via the authorization server.
 * The authorization server proxies to Keycloak.
 */
export async function apiLogin(
  username: string,
  password: string,
  options?: { baseUrl?: string },
): Promise<AuthResponse> {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const res = await fetch(`${baseUrl}${AUTH_SERVER_ENDPOINTS.LOGIN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, set_cookie: false }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || `Login failed with status ${res.status}`,
    );
  }

  return res.json();
}

/**
 * Refresh the auth token using a refresh token.
 */
export async function apiRefreshToken(
  refreshToken: string,
  options?: { baseUrl?: string },
): Promise<AuthResponse> {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const res = await fetch(`${baseUrl}${AUTH_SERVER_ENDPOINTS.REFRESH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken, set_cookie: false }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || `Token refresh failed with status ${res.status}`,
    );
  }

  return res.json();
}

/**
 * Fetch the access snapshot (menus + permissions) for the current user and app.
 */
export async function apiFetchAccessSnapshot(
  accessToken: string,
  options?: { baseUrl?: string; appCode?: string },
): Promise<AccessSnapshotResponse> {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const appCode = options?.appCode ?? getAppCode();
  const res = await fetch(
    `${baseUrl}${AUTH_SERVER_ENDPOINTS.ACCESS(appCode)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": "id",
      },
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || `Access snapshot fetch failed with status ${res.status}`,
    );
  }

  return res.json();
}

/**
 * Fetch the access token (JWT containing menus/permissions) for the current user and app.
 */
export async function apiFetchAccessToken(
  accessToken: string,
  options?: { baseUrl?: string; appCode?: string },
): Promise<AccessTokenResponse> {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const appCode = options?.appCode ?? getAppCode();
  const res = await fetch(
    `${baseUrl}${AUTH_SERVER_ENDPOINTS.ACCESS_TOKEN(appCode)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": "id",
      },
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || `Access token fetch failed with status ${res.status}`,
    );
  }

  return res.json();
}

/**
 * Fetch JWKS (public keys) from the authorization server for token verification.
 */
export async function apiFetchJWKS(
  options?: { baseUrl?: string },
): Promise<JWKSResponse> {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const res = await fetch(
    `${baseUrl}${AUTH_SERVER_ENDPOINTS.JWKS}`,
    { method: "GET" },
  );

  if (!res.ok) {
    throw new Error(`JWKS fetch failed with status ${res.status}`);
  }

  return res.json();
}

/**
 * Logout - invalidate the refresh token on the authorization server.
 */
export async function apiLogout(
  refreshToken: string,
  options?: { baseUrl?: string },
): Promise<{ success: boolean; message: string }> {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const res = await fetch(`${baseUrl}${AUTH_SERVER_ENDPOINTS.LOGOUT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || `Logout failed with status ${res.status}`,
    );
  }

  return res.json();
}

/**
 * Fetch the current user profile.
 */
export async function apiFetchUserProfile(
  accessToken: string,
  options?: { baseUrl?: string },
): Promise<UserProfileResponse> {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const res = await fetch(`${baseUrl}${AUTH_SERVER_ENDPOINTS.ME}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Accept-Language": "id",
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(
      error.message || `User profile fetch failed with status ${res.status}`,
    );
  }

  return res.json();
}
