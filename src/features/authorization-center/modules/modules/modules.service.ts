import { fetchModules, createModule, updateModule, deleteModule } from "./modules.repository";
import type { AppModuleCreatePayload, AppModuleListParams, AppModuleUpdatePayload } from "./modules.type";

export async function getModules(params: AppModuleListParams = {}, language?: string) {
  const response = await fetchModules(params, language);

  return response.data.items;
}

export async function createNewModule(payload: AppModuleCreatePayload, language?: string) {
  const response = await createModule(payload, language);

  return response.data;
}

export async function updateExistingModule(
  id: number,
  payload: AppModuleUpdatePayload,
  language?: string,
) {
  const response = await updateModule(id, payload, language);

  return response.data;
}

export async function deleteExistingModule(id: number, language?: string) {
  return deleteModule(id, language);
}
