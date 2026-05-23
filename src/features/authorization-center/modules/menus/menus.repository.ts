import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  AppMenu,
  AppMenuBulkCreateResponse,
  AppMenuCreatePayload,
  AppMenuDetailResponse,
  AppMenuListParams,
  AppMenuListResponse,
  AppMenuUpdatePayload,
  AppMenuUpdateResponse,
} from "./menus.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchMenusByApp(
  appCode: string,
  params: AppMenuListParams = {},
  language?: string,
): Promise<AppMenuListResponse> {
  const { limit = 50, offset = 0, search = "" } = params;
  const endpoint = endpoints.menus.listByApp(appCode);
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<AppMenuListResponse>(
    `${endpoint.url}?${query}`,
    { method: endpoint.method, baseUrl: getBaseUrl(), language },
  );
}

export async function fetchMenuDetail(
  id: number,
  language?: string,
): Promise<AppMenuDetailResponse> {
  const endpoint = endpoints.menus.detail(id);

  return apiClient<AppMenuDetailResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function bulkCreateMenus(
  payload: AppMenuCreatePayload[],
  language?: string,
): Promise<AppMenuBulkCreateResponse> {
  return apiClient<AppMenuBulkCreateResponse>(
    endpoints.menus.bulkCreate.url,
    {
      method: endpoints.menus.bulkCreate.method,
      baseUrl: getBaseUrl(),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      language,
    },
  );
}

export async function updateMenu(
  id: number,
  payload: AppMenuUpdatePayload,
  language?: string,
): Promise<AppMenuUpdateResponse> {
  const endpoint = endpoints.menus.update(id);

  return apiClient<AppMenuUpdateResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function deleteMenu(
  id: number,
  language?: string,
): Promise<void> {
  const endpoint = endpoints.menus.delete(id);

  return apiClient<void>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}
