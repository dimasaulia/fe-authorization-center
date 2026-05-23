import {
  bulkCreateMenus,
  deleteMenu,
  fetchMenuDetail,
  fetchMenusByApp,
  updateMenu,
} from "./menus.repository";
import type {
  AppMenuCreatePayload,
  AppMenuListParams,
  AppMenuUpdatePayload,
} from "./menus.type";

export async function getMenusByApp(
  appCode: string,
  params: AppMenuListParams = {},
  language?: string,
) {
  const response = await fetchMenusByApp(appCode, params, language);

  return response.data.items;
}

export async function getMenuDetail(id: number, language?: string) {
  const response = await fetchMenuDetail(id, language);

  return response.data;
}

export async function bulkCreateNewMenus(
  payload: AppMenuCreatePayload[],
  language?: string,
) {
  const response = await bulkCreateMenus(payload, language);

  return response.data;
}

export async function updateExistingMenu(
  id: number,
  payload: AppMenuUpdatePayload,
  language?: string,
) {
  const response = await updateMenu(id, payload, language);

  return response.data;
}

export async function deleteExistingMenu(id: number, language?: string) {
  return deleteMenu(id, language);
}
