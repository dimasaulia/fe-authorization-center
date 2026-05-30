/**
 * Shared auth error helpers for internal API routes and client auth handling.
 */

export class ApiResponseError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiResponseError";
    this.status = status;
  }
}

export function isAuthenticationFailure(error: unknown): boolean {
  if (error instanceof ApiResponseError && error.status === 401) {
    return true;
  }

  if (typeof error === "number") {
    return error === 401;
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : null;

  if (!message) {
    return false;
  }

  const normalized = message.toLowerCase();

  return [
    "not authenticated",
    "unauthenticated",
    "no refresh token",
    "invalid token",
    "token invalid",
    "token autentikasi tidak valid",
    "token tidak valid",
    "refresh token",
  ].some((marker) => normalized.includes(marker));
}
