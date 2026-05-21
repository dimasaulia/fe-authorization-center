"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { routes } from "@/config/routes.config";

import { createNewAction } from "../../../modules/actions/actions.service";
import type { ActionCreatePayload } from "../../../modules/actions/actions.type";

export function useActionCreateController() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const submit = useCallback(
    async (payload: ActionCreatePayload) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await createNewAction(payload);
        router.push(routes.actions);
      } catch (err) {
        console.error("[useActionCreateController] createAction failed:", err);
        setError("Failed to create action. Please try again.");
        setIsSubmitting(false);
      }
    },
    [router],
  );

  return { error, isSubmitting, slugify, submit };
}
