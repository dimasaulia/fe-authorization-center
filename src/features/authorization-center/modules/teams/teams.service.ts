import { fetchTeams, createTeam } from "./teams.repository";
import type { TeamCreatePayload, TeamListParams } from "./teams.type";

export async function getTeams(params: TeamListParams = {}) {
  const response = await fetchTeams(params);

  return response.data.items;
}

export async function createNewTeam(payload: TeamCreatePayload) {
  const response = await createTeam(payload);

  return response.data;
}
