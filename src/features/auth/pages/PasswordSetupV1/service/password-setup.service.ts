import { postPasswordSetup } from "../repository/password-setup.repository";
import type { PasswordSetupPayload } from "../types/password-setup.type";

export async function setupPassword(
  payload: PasswordSetupPayload,
  language?: string,
) {
  return postPasswordSetup(payload, language);
}
