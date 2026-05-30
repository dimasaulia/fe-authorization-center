import { envConfig } from "@/config/env.config";
import { useAuthStore } from "@/modules/opensuite-sdk/auth-store";
import { INTERNAL_API_ROUTES, DEFAULTS } from "@/modules/opensuite-sdk/constants";

type RequestOptions = RequestInit & {
  baseUrl?: string;
  language?: string;
  /** Skip Authorization header (for public endpoints) */
  public?: boolean;
};

/**
 * Authenticated API client.
 * 
 * Reads access token from zustand store (persisted in sessionStorage).
 * Token is immediately available on hard reload — no async waiting needed.
 * 
 * If a 401 is received, triggers a token refresh and retries once.
 * If refresh fails (refresh_token expired), redirects to login.
 */
export async function apiClient<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const {
    baseUrl = envConfig.authorizationCenterUrl,
    language,
    public: isPublic = false,
    ...requestOptions
  } = options;

  const headers = new Headers(requestOptions.headers);

  if (language) {
    headers.set("Accept-Language", language);
  }

  // Inject Authorization header from zustand store (sync read)
  if (!isPublic) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...requestOptions,
    headers,
  });

  // Handle 401 - attempt token refresh and retry once
  if (response.status === 401 && !isPublic) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      // Retry with new token
      const newToken = useAuthStore.getState().accessToken;
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
      }
      const retryResponse = await fetch(url, {
        ...requestOptions,
        headers,
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json().catch(() => ({}));
        throw new Error(
          error.message || `Request failed with status ${retryResponse.status}`,
        );
      }

      return retryResponse.json() as Promise<TResponse>;
    }

    // Refresh failed → redirect to login
    useAuthStore.getState().clearAuth();
    await fetch(INTERNAL_API_ROUTES.LOGOUT, { method: "POST" }).catch(() => undefined);
    window.location.assign(DEFAULTS.LOGIN_ROUTE);
    throw new Error("Session expired. Redirecting to login.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<TResponse>;
}

/**
 * Attempt to refresh the auth token via the internal API route.
 * Updates the zustand store on success.
 */
async function attemptRefresh(): Promise<boolean> {
  try {
    const res = await fetch(INTERNAL_API_ROUTES.REFRESH, { method: "POST" });
    if (!res.ok) return false;

    const data = await res.json();
    if (data.success && data.data.access_token) {
      useAuthStore.getState().setTokens({
        accessToken: data.data.access_token,
        expiresIn: data.data.expires_in,
        sessionState: data.data.session_state,
      });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
