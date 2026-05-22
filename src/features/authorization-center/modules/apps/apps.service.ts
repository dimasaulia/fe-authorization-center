import { fetchApps, fetchAppByCode, createApp, updateApp } from "./apps.repository";
import type { AppCreatePayload, AppListParams } from "./apps.type";

export async function getApps(params: AppListParams = {}, language?: string) {
  const response = await fetchApps(params, language);

  return response.data.items;
}

export async function getAppByCode(code: string, language?: string) {
  const response = await fetchAppByCode(code, language);

  return response.data;
}

export async function createNewApp(payload: AppCreatePayload, language?: string) {
  const response = await createApp(payload, language);

  return response.data;
}

export async function updateExistingApp(
  id: number,
  payload: Partial<AppCreatePayload>,
  language?: string,
) {
  const response = await updateApp(id, payload, language);

  return response.data;
}
