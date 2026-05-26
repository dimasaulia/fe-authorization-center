import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  UserCreatePayload,
  UserCreateResponse,
  UserListParams,
  UserListResponse,
  UserSignupPayload,
  UserSignupResponse,
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
