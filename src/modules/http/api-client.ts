import { envConfig } from "@/config/env.config";
import { getAccessToken, handleTokenExpired } from "@/modules/opensuite-sdk/token-store";

type RequestOptions = RequestInit & {
  baseUrl?: string;
  language?: string;
  /** Skip Authorization header (for public endpoints) */
  public?: boolean;
};

/**
 * API client for making authenticated requests directly from the browser.
 * 
 * Automatically injects the Authorization header from the in-memory token store.
 * If a 401 is received, triggers a token refresh and retries once.
 * 
 * Usage:
 * ```ts
 * // Authenticated request (default)
 * const users = await apiClient<UserListResponse>("/api/v1/users");
 * 
 * // POST with body
 * const result = await apiClient<CreateResponse>("/api/v1/users", {
 *   method: "POST",
 *   body: JSON.stringify({ name: "John" }),
 * });
 * 
 * // Public request (no auth header)
 * const health = await apiClient<HealthResponse>("/health", { public: true });
 * ```
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

  // Inject Authorization header for authenticated requests
  if (!isPublic) {
    const token = getAccessToken();
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
    await handleTokenExpired();

    // Retry with new token
    const newToken = getAccessToken();
    if (newToken) {
      headers.set("Authorization", `Bearer ${newToken}`);
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

    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<TResponse>;
}
