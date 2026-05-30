import { routes } from "@/config/routes.config";
import { envConfig } from "@/config/env.config";

export function getSetupPasswordUrl() {
  if (envConfig.setupPasswordUrl) {
    return envConfig.setupPasswordUrl;
  }

  if (typeof window !== "undefined") {
    return new URL(routes.passwordSetup, window.location.origin).toString();
  }

  return routes.passwordSetup;
}
