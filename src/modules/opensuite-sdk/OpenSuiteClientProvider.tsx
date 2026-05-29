"use client";

/**
 * OpenSuite SDK - Client Provider Wrapper
 * 
 * This wraps the OpenSuiteProvider for use in the root layout (server component).
 * Configuration is read from environment variables.
 */

import type { ReactNode } from "react";
import { OpenSuiteProvider } from "@/modules/opensuite-sdk";
import { envConfig } from "@/config/env.config";
import { appConfig } from "@/config/app.config";

interface OpenSuiteClientProviderProps {
  children: ReactNode;
}

export function OpenSuiteClientProvider({ children }: OpenSuiteClientProviderProps) {
  return (
    <OpenSuiteProvider
      config={{
        appCode: appConfig.appCode,
        authServerUrl: envConfig.authorizationCenterUrl,
        loginRoute: "/login",
        defaultRoute: "/dashboard",
        accessTokenRefreshInterval: 4 * 60 * 1000, // 4 minutes
      }}
    >
      {children}
    </OpenSuiteProvider>
  );
}
