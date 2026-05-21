"use client";

import { useCallback, useEffect, useState } from "react";

import { getApps } from "../../../modules/apps/apps.service";
import type { App } from "../../../modules/apps/apps.type";

export function useAppsListController() {
  const [apps, setApps] = useState<App[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApps = useCallback(async (searchValue: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getApps({ limit: 10, offset: 0, search: searchValue });

      setApps(items);
    } catch (err) {
      console.error("[useAppsListController] fetchApps failed:", err);
      setError("Failed to load apps. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void loadApps(search);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, loadApps]);

  return {
    apps,
    error,
    isLoading,
    search,
    setSearch,
    reload: () => loadApps(search),
  };
}
