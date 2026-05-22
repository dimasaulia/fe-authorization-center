import {
  bulkCreatePermissions,
  deletePermission,
  fetchPermissionDetail,
  fetchPermissions,
  fetchPermissionsByApp,
  updatePermission,
} from "./permissions.repository";
import type {
  PermissionCreatePayload,
  PermissionListParams,
  PermissionUpdatePayload,
} from "./permissions.type";

export async function getPermissions(
  params: PermissionListParams = {},
  language?: string,
) {
  const response = await fetchPermissions(params, language);

  return response.data.items;
}

export async function getPermissionsByApp(
  appCode: string,
  params: PermissionListParams = {},
  language?: string,
) {
  const response = await fetchPermissionsByApp(appCode, params, language);

  return response.data.items;
}

export async function getPermissionDetail(id: number, language?: string) {
  const response = await fetchPermissionDetail(id, language);

  return response.data;
}

export async function bulkCreateNewPermissions(
  payload: PermissionCreatePayload[],
  language?: string,
) {
  const response = await bulkCreatePermissions(payload, language);

  return response.data;
}

export async function updateExistingPermission(
  id: number,
  payload: PermissionUpdatePayload,
  language?: string,
) {
  const response = await updatePermission(id, payload, language);

  return response.data;
}

export async function deleteExistingPermission(id: number, language?: string) {
  return deletePermission(id, language);
}
