"use client";

import { useCallback, useEffect, useState } from "react";

import { getTeams } from "../../../modules/teams/teams.service";
import type { Team } from "../../../modules/teams/teams.type";

export function useTeamsListController() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTeams = useCallback(async (searchValue: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getTeams({ search: searchValue });

      setTeams(items);
    } catch (err) {
      console.error("[useTeamsListController] fetchTeams failed:", err);
      setError("Failed to load teams. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadTeams(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, loadTeams]);

  return {
    teams,
    error,
    isLoading,
    search,
    setSearch,
    reload: () => loadTeams(search),
  };
}
