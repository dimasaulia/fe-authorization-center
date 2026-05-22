"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { createNewModule } from "../../../modules/modules/modules.service";
import type { AppModuleCreatePayload } from "../../../modules/modules/modules.type";

type UseAppModuleCreateControllerProps = {
  appId: number;
  appCode: string;
};

export function useAppModuleCreateController({
  appId,
  appCode,
}: UseAppModuleCreateControllerProps) {
  const router = useRouter();
  const { language, t } = usePreferences();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildCode = (moduleSlug: string) =>
    moduleSlug ? `${appCode}.${moduleSlug}` : "";

  const submit = useCallback(
    async (payload: Omit<AppModuleCreatePayload, "app_id">) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await createNewModule({ ...payload, app_id: appId }, language);
        router.push(routes.appModules(appCode));
      } catch {
        setError(t("authz.moduleCreate.error"));
        setIsSubmitting(false);
      }
    },
    [appId, appCode, language, router, t],
  );

  return { buildCode, error, isSubmitting, slugify, submit };
}
