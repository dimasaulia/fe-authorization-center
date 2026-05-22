"use client";

import { useEffect, useState } from "react";

import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import type { App } from "../../../modules/apps/apps.type";

export function useAppCredentialsController(appCode: string) {
  const { language, t } = usePreferences();
  const [app, setApp] = useState<App | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAppByCode(appCode, language)
      .then((data) => {
        if (!cancelled) {
          setApp(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("common.error.loadFailed"));
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appCode, language, t]);

  return { app, error, isLoading };
}
