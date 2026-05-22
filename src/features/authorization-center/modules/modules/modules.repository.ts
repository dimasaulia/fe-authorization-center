import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  AppModuleCreatePayload,
  AppModuleCreateResponse,
  AppModuleListParams,
  AppModuleListResponse,
  AppModuleUpdatePayload,
} from "./modules.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchModules(
  params: AppModuleListParams = {},
  language?: string,
): Promise<AppModuleListResponse> {
  const { limit = 20, offset = 0, search = "" } = params;
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<AppModuleListResponse>(
    `${endpoints.modules.list.url}?${query}`,
    { method: endpoints.modules.list.method, baseUrl: getBaseUrl(), language },
  );
}

export async function fetchModulesByApp(
  appCode: string,
  params: AppModuleListParams = {},
  language?: string,
): Promise<AppModuleListResponse> {
  const { limit = 100, offset = 0, search = "" } = params;
  const endpoint = endpoints.modules.listByApp(appCode);
  const query = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    search,
  }).toString();

  return apiClient<AppModuleListResponse>(
    `${endpoint.url}?${query}`,
    { method: endpoint.method, baseUrl: getBaseUrl(), language },
  );
}

export async function createModule(
  payload: AppModuleCreatePayload,
  language?: string,
): Promise<AppModuleCreateResponse> {
  return apiClient<AppModuleCreateResponse>(endpoints.modules.create.url, {
    method: endpoints.modules.create.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function updateModule(
  id: number,
  payload: AppModuleUpdatePayload,
  language?: string,
): Promise<AppModuleCreateResponse> {
  const endpoint = endpoints.modules.update(id);

  return apiClient<AppModuleCreateResponse>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    language,
  });
}

export async function deleteModule(
  id: number,
  language?: string,
): Promise<void> {
  const endpoint = endpoints.modules.delete(id);

  return apiClient<void>(endpoint.url, {
    method: endpoint.method,
    baseUrl: getBaseUrl(),
    language,
  });
}
