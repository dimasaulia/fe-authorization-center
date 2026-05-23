"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { createNewRole } from "../../../modules/roles/roles.service";
import type { App } from "../../../modules/apps/apps.type";

export function useAppRoleCreateController(appCode: string) {
  const router = useRouter();
  const { language, t } = usePreferences();
  const [app, setApp] = useState<App | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAppByCode(appCode, language)
      .then((appData) => {
        if (!cancelled) {
          setApp(appData);
          setIsLoadingApp(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("common.error.loadFailed"));
          setIsLoadingApp(false);
        }
      });

    return () => { cancelled = true; };
  }, [appCode, language, t]);

  const submit = useCallback(
    async (values: {
      name: string;
      code: string;
      description: string;
      is_system: boolean;
      status: "active" | "inactive";
    }) => {
      if (!app) return;
      setIsSubmitting(true);
      setError(null);
      try {
        await createNewRole(
          {
            organization_id: null,
            app_id: app.id,
            scope: "app",
            ...values,
          },
          language,
        );
        router.push(routes.appRoles(appCode));
      } catch {
        setError(t("authz.roleCreate.error"));
        setIsSubmitting(false);
      }
    },
    [app, appCode, language, router, t],
  );

  return { app, error, isLoadingApp, isSubmitting, slugify, submit };
}
