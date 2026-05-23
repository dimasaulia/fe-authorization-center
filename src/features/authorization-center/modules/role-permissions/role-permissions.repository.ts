import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  AvailablePermissionsResponse,
  RolePermissionBulkCreatePayload,
  RolePermissionBulkCreateResponse,
  RolePermissionDetailResponse,
  RolePermissionListResponse,
  RolePermissionUpdateByRolePayload,
  RolePermissionUpdateByRoleResponse,
  RoleSummaryListResponse,
} from "./role-permissions.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchRolePermissionsByApp(
  appCode: string,
  language?: string,
): Promise<RolePermissionListResponse> {
  const endpoint = endpoints.rolePermissions.listByApp(appCode);

  return apiClient<RolePermissionListResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function fetchRoleSummariesByApp(
  appCode: string,
  language?: string,
): Promise<RoleSummaryListResponse> {
  const endpoint = endpoints.rolePermissions.roleSummariesByApp(appCode);

  return apiClient<RoleSummaryListResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function fetchAvailablePermissionsByApp(
  appCode: string,
  language?: string,
): Promise<AvailablePermissionsResponse> {
  const endpoint = endpoints.rolePermissions.availablePermissionsByApp(appCode);

  return apiClient<AvailablePermissionsResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function bulkCreateRolePermissions(
  payload: RolePermissionBulkCreatePayload,
  language?: string,
): Promise<RolePermissionBulkCreateResponse> {
  return apiClient<RolePermissionBulkCreateResponse>(
    endpoints.rolePermissions.bulkCreate.url,
    {
      method: endpoints.rolePermissions.bulkCreate.method,
      baseUrl: getBaseUrl(),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      language,
    },
  );
}

export async function fetchRolePermissionDetail(
  id: number,
  language?: string,
): Promise<RolePermissionDetailResponse> {
  const endpoint = endpoints.rolePermissions.detail(id);

  return apiClient<RolePermissionDetailResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function deleteRolePermission(
  id: number,
  language?: string,
): Promise<void> {
  const endpoint = endpoints.rolePermissions.delete(id);

  return apiClient<void>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function fetchRolePermissionsByRole(
  roleCode: string,
  language?: string,
): Promise<RolePermissionListResponse> {
  const endpoint = endpoints.rolePermissions.listByRole(roleCode);

  return apiClient<RolePermissionListResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function updateRolePermissionsByRole(
  roleId: number,
  payload: RolePermissionUpdateByRolePayload,
  language?: string,
): Promise<RolePermissionUpdateByRoleResponse> {
  const endpoint = endpoints.rolePermissions.updateByRole(roleId);

  return apiClient<RolePermissionUpdateByRoleResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}
