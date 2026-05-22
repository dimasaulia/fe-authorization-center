import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  AppCreatePayload,
  AppCreateResponse,
  AppListParams,
  AppListResponse,
} from "./apps.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchApps(
  params: AppListParams = {},
  language?: string,
): Promise<AppListResponse> {
  const { limit = 10, offset = 0, search = "" } = params;
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<AppListResponse>(
    `${endpoints.apps.list.url}?${query}`,
    { method: endpoints.apps.list.method, baseUrl: getBaseUrl(), language },
  );
}

export async function fetchAppByCode(
  code: string,
  language?: string,
): Promise<AppCreateResponse> {
  const endpoint = endpoints.apps.detail(code);

  return apiClient<AppCreateResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}

export async function createApp(
  payload: AppCreatePayload,
  language?: string,
): Promise<AppCreateResponse> {
  return apiClient<AppCreateResponse>(endpoints.apps.create.url, {
    method: endpoints.apps.create.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function updateApp(
  id: number,
  payload: Partial<AppCreatePayload>,
  language?: string,
): Promise<AppCreateResponse> {
  const endpoint = endpoints.apps.update(id);

  return apiClient<AppCreateResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}
