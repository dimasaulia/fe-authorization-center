"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { routes } from "@/config/routes.config";

import { createNewTeam } from "../../../modules/teams/teams.service";
import type { TeamCreatePayload } from "../../../modules/teams/teams.type";

export function useTeamCreateController() {
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
    async (payload: TeamCreatePayload) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await createNewTeam(payload);
        router.push(routes.teams);
      } catch (err) {
        console.error("[useTeamCreateController] createTeam failed:", err);
        setError("Failed to create team. Please try again.");
        setIsSubmitting(false);
      }
    },
    [router],
  );

  return { error, isSubmitting, slugify, submit };
}
