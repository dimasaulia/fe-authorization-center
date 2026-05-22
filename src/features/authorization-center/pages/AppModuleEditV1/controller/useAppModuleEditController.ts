"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { getModulesByApp, updateExistingModule } from "../../../modules/modules/modules.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AppModule, AppModuleUpdatePayload } from "../../../modules/modules/modules.type";

export function useAppModuleEditController(appCode: string, moduleId: string) {
  const router = useRouter();
  const { language, t } = usePreferences();
  const [app, setApp] = useState<App | null>(null);
  const [mod, setMod] = useState<AppModule | null>(null);
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [moduleSlug, setModuleSlug] = useState("");
  const [codeOverride, setCodeOverride] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  useEffect(() => {
    let cancelled = false;

    getAppByCode(appCode, language)
      .then((appData) => {
        if (cancelled) return;

        return getModulesByApp(appCode, { limit: 100, offset: 0, search: "" }, language).then(
          (items) => {
            if (cancelled) return;
            const found = items.find((m) => m.id === Number(moduleId)) ?? null;

            setApp(appData);
            setMod(found);

            if (found) {
              const prefix = `${appData.code}.`;
              const slug = found.code.startsWith(prefix)
                ? found.code.slice(prefix.length)
                : found.code;

              setName(found.name);
              setModuleSlug(slug);
              setStatus(found.status);
            }

            setIsLoadingApp(false);
          },
        );
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
  }, [appCode, moduleId, language, t]);

  const submit = useCallback(
    async (payload: AppModuleUpdatePayload) => {
      if (!mod) return;
      setIsSubmitting(true);
      setError(null);
      try {
        await updateExistingModule(mod.id, payload, language);
        router.push(routes.appModules(appCode));
      } catch {
        setError(t("authz.moduleEdit.error"));
        setIsSubmitting(false);
      }
    },
    [mod, appCode, language, router, t],
  );

  return {
    app,
    codeOverride,
    error,
    isLoadingApp,
    isSubmitting,
    mod,
    moduleSlug,
    name,
    setCodeOverride,
    setModuleSlug,
    setName,
    setStatus,
    slugify,
    status,
    submit,
  };
}
