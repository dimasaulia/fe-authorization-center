"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { createNewModule } from "../../../modules/modules/modules.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AppModuleCreatePayload } from "../../../modules/modules/modules.type";

export function useAppModuleCreatePageController(appCode: string) {
  const router = useRouter();
  const { language, t } = usePreferences();
  const [app, setApp] = useState<App | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAppByCode(appCode, language)
      .then((data) => {
        if (!cancelled) {
          setApp(data);
          setIsLoadingApp(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("common.error.loadFailed"));
          setIsLoadingApp(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appCode, language, t]);

  const buildCode = (moduleSlug: string) =>
    app && moduleSlug ? `${app.code}.${moduleSlug}` : "";

  const submit = useCallback(
    async (payload: Omit<AppModuleCreatePayload, "app_id">) => {
      if (!app) return;
      setIsSubmitting(true);
      setError(null);
      try {
        await createNewModule({ ...payload, app_id: app.id }, language);
        router.push(routes.appModules(appCode));
      } catch {
        setError(t("authz.moduleCreate.error"));
        setIsSubmitting(false);
      }
    },
    [app, appCode, language, router, t],
  );

  return { app, buildCode, error, isLoadingApp, isSubmitting, slugify, submit };
}
