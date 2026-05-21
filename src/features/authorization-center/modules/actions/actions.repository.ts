import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  ActionCreatePayload,
  ActionCreateResponse,
  ActionListParams,
  ActionListResponse,
} from "./actions.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchActions(params: ActionListParams = {}): Promise<ActionListResponse> {
  const { search = "" } = params;
  const query = new URLSearchParams({ search }).toString();

  return apiClient<ActionListResponse>(
    `${endpoints.actions.list.url}?${query}`,
    { method: endpoints.actions.list.method, baseUrl: getBaseUrl() },
  );
}

export async function createAction(payload: ActionCreatePayload): Promise<ActionCreateResponse> {
  return apiClient<ActionCreateResponse>(endpoints.actions.create.url, {
    method: endpoints.actions.create.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
