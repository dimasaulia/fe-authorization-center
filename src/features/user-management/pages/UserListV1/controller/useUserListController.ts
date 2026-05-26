"use client";

import { useCallback, useEffect, useState } from "react";

import { usePreferences } from "@/modules/preferences";

import { getUsers } from "../../../modules/users/users.service";
import type { User } from "../../../modules/users/users.type";

export function useUserListController() {
  const { language, t } = usePreferences();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    (q: string) => {
      setIsLoading(true);
      setError(null);

      getUsers({ limit: 20, offset: 0, search: q }, language)
        .then((items) => {
          setUsers(items);
          setIsLoading(false);
        })
        .catch(() => {
          setError(t("common.error.loadFailed"));
          setIsLoading(false);
        });
    },
    [language, t],
  );

  useEffect(() => {
    const timer = setTimeout(() => load(search), 300);

    return () => clearTimeout(timer);
  }, [search, load]);

  return {
    users,
    search,
    setSearch,
    isLoading,
    error,
  };
}
