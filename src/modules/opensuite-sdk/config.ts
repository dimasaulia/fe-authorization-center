/**
 * OpenSuite SDK Configuration
 * Singleton configuration for the SDK instance.
 */

import { DEFAULTS } from "./constants";
import type { OpenSuiteConfig } from "./types";

let _config: OpenSuiteConfig | null = null;

export function initOpenSuite(config: OpenSuiteConfig): void {
  _config = {
    accessTokenRefreshInterval: DEFAULTS.ACCESS_REFRESH_INTERVAL_MS,
    loginRoute: DEFAULTS.LOGIN_ROUTE,
    defaultRoute: DEFAULTS.DEFAULT_ROUTE,
    ssoCallbackRoute: DEFAULTS.SSO_CALLBACK_ROUTE,
    ...config,
  };
}

export function getOpenSuiteConfig(): OpenSuiteConfig {
  if (!_config) {
    throw new Error(
      "[OpenSuite SDK] Not initialized. Call initOpenSuite() before using the SDK.",
    );
  }
  return _config;
}
