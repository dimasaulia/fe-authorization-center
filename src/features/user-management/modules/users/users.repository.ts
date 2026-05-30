import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  UserCreatePayload,
  UserCreateResponse,
  UserActionResponse,
  UserListParams,
  UserListResponse,
  UserDetailResponse,
  PasswordSetupPayload,
  UserSignupPayload,
  UserSignupResponse,
  UserUpdatePayload,
  UserUpdateResponse,
  VerifyEmailResponse,
} from "./users.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchUsers(
  params: UserListParams = {},
  language?: string,
): Promise<UserListResponse> {
  const { limit = 20, offset = 0, search = "" } = params;
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<UserListResponse>(
    `${endpoints.user.list.url}?${query}`,
    { method: endpoints.user.list.method, baseUrl: getBaseUrl(), language },
  );
}

export async function fetchUserDetail(
  id: number,
  language?: string,
): Promise<UserDetailResponse> {
  const endpoint = endpoints.user.detail(id);

  return apiClient<UserDetailResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function createUser(
  payload: UserCreatePayload,
  language?: string,
): Promise<UserCreateResponse> {
  return apiClient<UserCreateResponse>(endpoints.user.create.url, {
    method: endpoints.user.create.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function updateUser(
  id: number,
  payload: UserUpdatePayload,
  language?: string,
): Promise<UserUpdateResponse> {
  const endpoint = endpoints.user.update(id);

  return apiClient<UserUpdateResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function deleteUser(
  id: number,
  language?: string,
): Promise<UserActionResponse> {
  const endpoint = endpoints.user.delete(id);

  return apiClient<UserActionResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function resendUserInvitation(
  id: number,
  setupPasswordUrl: string,
  language?: string,
): Promise<UserActionResponse> {
  const endpoint = endpoints.user.resendInvitation(id);
  const query = new URLSearchParams({
    setup_password_url: setupPasswordUrl,
  }).toString();

  return apiClient<UserActionResponse>(`${endpoint.url}?${query}`, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function setupUserPassword(
  payload: PasswordSetupPayload,
  language?: string,
): Promise<UserActionResponse> {
  const response = await fetch(`${getBaseUrl()}${endpoints.user.passwordSetup.url}`, {
    method: endpoints.user.passwordSetup.method,
    headers: {
      "Content-Type": "application/json",
      ...(language ? { "Accept-Language": language } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<UserActionResponse>;
}

export async function signupUser(
  payload: UserSignupPayload,
  language?: string,
): Promise<UserSignupResponse> {
  return apiClient<UserSignupResponse>(endpoints.user.signup.url, {
    method: endpoints.user.signup.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function verifyEmail(
  code: string,
  language?: string,
): Promise<VerifyEmailResponse> {
  return apiClient<VerifyEmailResponse>(
    `${endpoints.user.verifyEmail.url}?code=${encodeURIComponent(code)}`,
    { method: endpoints.user.verifyEmail.method, baseUrl: getBaseUrl(), language },
  );
}
