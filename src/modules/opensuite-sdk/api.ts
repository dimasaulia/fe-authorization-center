/**
 * OpenSuite SDK - Auth API Client
 * Handles communication with the authorization server for authentication.
 */

import { getOpenSuiteConfig } from "./config";
import { AUTH_SERVER_ENDPOINTS } from "./constants";
import { ApiResponseError } from "./auth-errors";
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

async function parseJsonResponse<TResponse>(
  res: Response,
  label: string,
): Promise<TResponse> {
  const text = await res.text();
  const contentType = res.headers.get("content-type") ?? "unknown";

  if (!text) {
    throw new Error(`${label} returned an empty response with status ${res.status}`);
  }

  try {
    return JSON.parse(text) as TResponse;
  } catch {
    const bodyPreview = text.replace(/\s+/g, " ").slice(0, 160);
    throw new Error(
      `${label} returned non-JSON response with status ${res.status} (${contentType}): ${bodyPreview}`,
    );
  }
}

async function readApiResponse<TResponse>(
  res: Response,
  label: string,
): Promise<TResponse> {
  const data = await parseJsonResponse<TResponse & { message?: string }>(res, label);

  if (!res.ok) {
    throw new ApiResponseError(
      data.message || `${label} failed with status ${res.status}`,
      res.status,
    );
  }

  return data;
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

  return readApiResponse<AuthResponse>(res, "Login");
}

/**
 * Build the Authorization Center Keycloak SSO redirect URL.
 */
export function buildKeycloakSsoRedirectUrl(options?: {
  baseUrl?: string;
  callbackUrl?: string;
  prompt?: string;
}): string {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const url = new URL(`${baseUrl}${AUTH_SERVER_ENDPOINTS.KEYCLOAK_REDIRECT}`);
  if (options?.callbackUrl) {
    url.searchParams.set("callback_url", options.callbackUrl);
  }
  if (options?.prompt) {
    url.searchParams.set("prompt", options.prompt);
  }
  return url.toString();
}

/**
 * Exchange a one-time SSO callback code for Keycloak tokens.
 */
export async function apiExchangeKeycloakSsoCode(
  code: string,
  options?: { baseUrl?: string },
): Promise<AuthResponse> {
  const baseUrl = options?.baseUrl ?? getBaseUrl();
  const res = await fetch(`${baseUrl}${AUTH_SERVER_ENDPOINTS.KEYCLOAK_EXCHANGE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  return readApiResponse<AuthResponse>(res, "SSO exchange");
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

  return readApiResponse<AuthResponse>(res, "Token refresh");
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

  return readApiResponse<AccessSnapshotResponse>(res, "Access snapshot fetch");
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

  return readApiResponse<AccessTokenResponse>(res, "Access token fetch");
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

  return readApiResponse<JWKSResponse>(res, "JWKS fetch");
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

  return readApiResponse<{ success: boolean; message: string }>(res, "Logout");
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

  return readApiResponse<UserProfileResponse>(res, "User profile fetch");
}
