import {
  createRole,
  deleteRole,
  fetchRoleDetail,
  fetchRoles,
  fetchRolesByApp,
  updateRole,
} from "./roles.repository";
import type {
  RoleCreatePayload,
  RoleListParams,
  RoleUpdatePayload,
} from "./roles.type";

export async function getRoles(params: RoleListParams = {}, language?: string) {
  const response = await fetchRoles(params, language);

  return response.data.items;
}

export async function getRolesByApp(
  appCode: string,
  params: RoleListParams = {},
  language?: string,
) {
  const response = await fetchRolesByApp(appCode, params, language);

  return response.data.items;
}

export async function getRoleDetail(id: number, language?: string) {
  const response = await fetchRoleDetail(id, language);

  return response.data;
}

export async function createNewRole(
  payload: RoleCreatePayload,
  language?: string,
) {
  const response = await createRole(payload, language);

  return response.data;
}

export async function updateExistingRole(
  id: number,
  payload: RoleUpdatePayload,
  language?: string,
) {
  const response = await updateRole(id, payload, language);

  return response.data;
}

export async function deleteExistingRole(id: number, language?: string) {
  return deleteRole(id, language);
}
