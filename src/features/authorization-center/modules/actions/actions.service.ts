import { fetchActions, createAction } from "./actions.repository";
import type { ActionCreatePayload, ActionListParams } from "./actions.type";

export async function getActions(params: ActionListParams = {}) {
  const response = await fetchActions(params);

  return response.data.items;
}

export async function createNewAction(payload: ActionCreatePayload) {
  const response = await createAction(payload);

  return response.data;
}
