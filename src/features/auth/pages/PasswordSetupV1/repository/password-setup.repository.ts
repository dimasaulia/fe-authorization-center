import { endpoints } from "@/config/endpoints.config";
import { envConfig } from "@/config/env.config";

import type {
  PasswordSetupPayload,
  PasswordSetupResponse,
} from "../types/password-setup.type";

export async function postPasswordSetup(
  payload: PasswordSetupPayload,
  language?: string,
): Promise<PasswordSetupResponse> {
  const response = await fetch(
    `${envConfig.authorizationCenterUrl}${endpoints.user.passwordSetup.url}`,
    {
      method: endpoints.user.passwordSetup.method,
      headers: {
        "Content-Type": "application/json",
        ...(language ? { "Accept-Language": language } : {}),
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  const responseText = await response.text();

  if (!responseText) {
    return {
      success: true,
      message: "Password set successfully.",
      data: null,
    };
  }

  return JSON.parse(responseText) as PasswordSetupResponse;
}
