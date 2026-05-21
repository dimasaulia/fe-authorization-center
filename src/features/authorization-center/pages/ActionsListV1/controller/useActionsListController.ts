"use client";

import { useCallback, useEffect, useState } from "react";

import { getActions } from "../../../modules/actions/actions.service";
import type { Action } from "../../../modules/actions/actions.type";

export function useActionsListController() {
  const [actions, setActions] = useState<Action[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActions = useCallback(async (searchValue: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getActions({ search: searchValue });

      setActions(items);
    } catch (err) {
      console.error("[useActionsListController] fetchActions failed:", err);
      setError("Failed to load actions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadActions(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, loadActions]);

  return {
    actions,
    error,
    isLoading,
    search,
    setSearch,
    reload: () => loadActions(search),
  };
}
