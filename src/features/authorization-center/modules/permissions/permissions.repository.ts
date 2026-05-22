import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  PermissionBulkCreateResponse,
  PermissionCreatePayload,
  PermissionDetailResponse,
  PermissionListParams,
  PermissionListResponse,
  PermissionUpdatePayload,
  PermissionUpdateResponse,
} from "./permissions.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchPermissions(
  params: PermissionListParams = {},
  language?: string,
): Promise<PermissionListResponse> {
  const { limit = 20, offset = 0, search = "" } = params;
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<PermissionListResponse>(
    `${endpoints.permissions.list.url}?${query}`,
    { method: endpoints.permissions.list.method, baseUrl: getBaseUrl(), language },
  );
}

export async function fetchPermissionsByApp(
  appCode: string,
  params: PermissionListParams = {},
  language?: string,
): Promise<PermissionListResponse> {
  const { limit = 50, offset = 0, search = "" } = params;
  const endpoint = endpoints.permissions.listByApp(appCode);
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<PermissionListResponse>(
    `${endpoint.url}?${query}`,
    { method: endpoint.method, baseUrl: getBaseUrl(), language },
  );
}

export async function fetchPermissionDetail(
  id: number,
  language?: string,
): Promise<PermissionDetailResponse> {
  const endpoint = endpoints.permissions.detail(id);

  return apiClient<PermissionDetailResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function bulkCreatePermissions(
  payload: PermissionCreatePayload[],
  language?: string,
): Promise<PermissionBulkCreateResponse> {
  return apiClient<PermissionBulkCreateResponse>(
    endpoints.permissions.bulkCreate.url,
    {
      method: endpoints.permissions.bulkCreate.method,
      baseUrl: getBaseUrl(),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      language,
    },
  );
}

export async function updatePermission(
  id: number,
  payload: PermissionUpdatePayload,
  language?: string,
): Promise<PermissionUpdateResponse> {
  const endpoint = endpoints.permissions.update(id);

  return apiClient<PermissionUpdateResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function deletePermission(
  id: number,
  language?: string,
): Promise<void> {
  const endpoint = endpoints.permissions.delete(id);

  return apiClient<void>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}
