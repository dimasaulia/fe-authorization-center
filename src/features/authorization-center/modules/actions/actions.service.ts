import { fetchActions, createAction } from "./actions.repository";
import type { ActionCreatePayload, ActionListParams } from "./actions.type";

export async function getActions(params: ActionListParams = {}, language?: string) {
  const response = await fetchActions(params, language);

  return response.data.items;
}

export async function createNewAction(payload: ActionCreatePayload, language?: string) {
  const response = await createAction(payload, language);

  return response.data;
}
