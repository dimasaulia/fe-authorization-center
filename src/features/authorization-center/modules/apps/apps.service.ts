import { fetchApps, createApp, updateApp } from "./apps.repository";
import type { AppCreatePayload, AppListParams } from "./apps.type";

export async function getApps(params: AppListParams = {}) {
  const response = await fetchApps(params);

  return response.data.items;
}

export async function createNewApp(payload: AppCreatePayload) {
  const response = await createApp(payload);

  return response.data;
}

export async function updateExistingApp(
  id: number,
  payload: Partial<AppCreatePayload>,
) {
  const response = await updateApp(id, payload);

  return response.data;
}
