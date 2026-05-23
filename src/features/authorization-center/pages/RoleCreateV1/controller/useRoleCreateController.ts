"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { createNewRole } from "../../../modules/roles/roles.service";

export function useRoleCreateController() {
  const router = useRouter();
  const { language, t } = usePreferences();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (values: {
      name: string;
      code: string;
      description: string;
      is_system: boolean;
      status: "active" | "inactive";
    }) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await createNewRole(
          {
            organization_id: null,
            app_id: null,
            scope: "global",
            ...values,
          },
          language,
        );
        router.push(routes.roles);
      } catch {
        setError(t("authz.roleCreate.error"));
        setIsSubmitting(false);
      }
    },
    [language, router, t],
  );

  return { error, isSubmitting, slugify, submit };
}
