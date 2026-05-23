import {
  bulkCreateRolePermissions,
  deleteRolePermission,
  fetchAvailablePermissionsByApp,
  fetchRolePermissionsByApp,
  fetchRolePermissionsByRole,
  fetchRoleSummariesByApp,
  updateRolePermissionsByRole,
} from "./role-permissions.repository";
import type {
  RolePermissionBulkCreatePayload,
  RolePermissionUpdateByRolePayload,
} from "./role-permissions.type";

export async function getRolePermissionsByApp(
  appCode: string,
  language?: string,
) {
  const response = await fetchRolePermissionsByApp(appCode, language);

  return response.data.items;
}

export async function getRoleSummariesByApp(
  appCode: string,
  language?: string,
) {
  const response = await fetchRoleSummariesByApp(appCode, language);

  return response.data.items;
}

export async function getAvailablePermissionsByApp(
  appCode: string,
  language?: string,
) {
  const response = await fetchAvailablePermissionsByApp(appCode, language);

  return response.data.items;
}

export async function bulkCreateNewRolePermissions(
  payload: RolePermissionBulkCreatePayload,
  language?: string,
) {
  const response = await bulkCreateRolePermissions(payload, language);

  return response.data;
}

export async function deleteExistingRolePermission(
  id: number,
  language?: string,
) {
  return deleteRolePermission(id, language);
}

export async function getRolePermissionsByRole(
  roleCode: string,
  language?: string,
) {
  const response = await fetchRolePermissionsByRole(roleCode, language);

  return response.data.items;
}

export async function updateExistingRolePermissionsByRole(
  roleId: number,
  payload: RolePermissionUpdateByRolePayload,
  language?: string,
) {
  const response = await updateRolePermissionsByRole(roleId, payload, language);

  return response.data;
}
