import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  RoleCreatePayload,
  RoleCreateResponse,
  RoleDetailResponse,
  RoleListParams,
  RoleListResponse,
  RoleUpdatePayload,
} from "./roles.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchRoles(
  params: RoleListParams = {},
  language?: string,
): Promise<RoleListResponse> {
  const { limit = 20, offset = 0, search = "" } = params;
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<RoleListResponse>(
    `${endpoints.roles.list.url}?${query}`,
    { method: endpoints.roles.list.method, baseUrl: getBaseUrl(), language },
  );
}

export async function fetchRolesByApp(
  appCode: string,
  params: RoleListParams = {},
  language?: string,
): Promise<RoleListResponse> {
  const { limit = 20, offset = 0, search = "" } = params;
  const endpoint = endpoints.roles.listByApp(appCode);
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<RoleListResponse>(
    `${endpoint.url}?${query}`,
    { method: endpoint.method, baseUrl: getBaseUrl(), language },
  );
}

export async function fetchRoleDetail(
  id: number,
  language?: string,
): Promise<RoleDetailResponse> {
  const endpoint = endpoints.roles.detail(id);

  return apiClient<RoleDetailResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function createRole(
  payload: RoleCreatePayload,
  language?: string,
): Promise<RoleCreateResponse> {
  return apiClient<RoleCreateResponse>(endpoints.roles.create.url, {
    method: endpoints.roles.create.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function updateRole(
  id: number,
  payload: RoleUpdatePayload,
  language?: string,
): Promise<RoleCreateResponse> {
  const endpoint = endpoints.roles.update(id);

  return apiClient<RoleCreateResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function deleteRole(
  id: number,
  language?: string,
): Promise<void> {
  const endpoint = endpoints.roles.delete(id);

  return apiClient<void>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}
