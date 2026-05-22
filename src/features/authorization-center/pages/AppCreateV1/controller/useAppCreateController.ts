"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { routes } from "@/config/routes.config";
import { slugify } from "@/shared/utils/slugify";

import { createNewApp } from "../../../modules/apps/apps.service";
import type { AppCreatePayload } from "../../../modules/apps/apps.type";

export function useAppCreateController() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (payload: AppCreatePayload) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const app = await createNewApp(payload);

        router.push(routes.appDetail(app.code));
      } catch {
        setError("Failed to create app. Please try again.");
        setIsSubmitting(false);
      }
    },
    [router],
  );

  return { error, isSubmitting, slugify, submit };
}
