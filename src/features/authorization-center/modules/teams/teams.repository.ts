import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";
import { apiClient } from "@/modules/http/api-client";

import type {
  TeamCreatePayload,
  TeamCreateResponse,
  TeamListParams,
  TeamListResponse,
} from "./teams.type";

function getBaseUrl() {
  return envConfig.authorizationCenterUrl;
}

export async function fetchTeams(params: TeamListParams = {}): Promise<TeamListResponse> {
  const { search = "" } = params;
  const query = new URLSearchParams({ search }).toString();

  return apiClient<TeamListResponse>(
    `${endpoints.teams.list.url}?${query}`,
    { method: endpoints.teams.list.method, baseUrl: getBaseUrl() },
  );
}

export async function createTeam(payload: TeamCreatePayload): Promise<TeamCreateResponse> {
  return apiClient<TeamCreateResponse>(endpoints.teams.create.url, {
    method: endpoints.teams.create.method,
    baseUrl: getBaseUrl(),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
