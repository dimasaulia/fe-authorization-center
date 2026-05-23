"use client";

import { useCallback, useEffect, useState } from "react";

import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import {
  deleteExistingRole,
  getRolesByApp,
} from "../../../modules/roles/roles.service";
import type { App } from "../../../modules/apps/apps.type";
import type { Role } from "../../../modules/roles/roles.type";

export function useAppRoleListController(appCode: string) {
  const { language, t } = usePreferences();
  const [app, setApp] = useState<App | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(
    (q: string) => {
      getAppByCode(appCode, language)
        .then((appData) => {
          setApp(appData);

          return getRolesByApp(appCode, { limit: 20, offset: 0, search: q }, language).then(
            (items) => {
              setRoles(items);
              setIsLoading(false);
            },
          );
        })
        .catch(() => {
          setError(t("common.error.loadFailed"));
          setIsLoading(false);
        });
    },
    [appCode, language, t],
  );

  useEffect(() => {
    const timer = setTimeout(() => load(search), 300);

    return () => clearTimeout(timer);
  }, [search, load]);

  const confirmDelete = useCallback((id: number) => setConfirmDeleteId(id), []);
  const cancelDelete = useCallback(() => setConfirmDeleteId(null), []);

  const executeDelete = useCallback(() => {
    if (confirmDeleteId === null) return;
    const id = confirmDeleteId;

    setDeletingId(id);
    setConfirmDeleteId(null);

    deleteExistingRole(id, language)
      .then(() => setRoles((prev) => prev.filter((r) => r.id !== id)))
      .catch(() => setError(t("authz.roleDelete.error")))
      .finally(() => setDeletingId(null));
  }, [confirmDeleteId, language, t]);

  return {
    app,
    cancelDelete,
    confirmDelete,
    confirmDeleteId,
    deletingId,
    error,
    executeDelete,
    isLoading,
    roles,
    search,
    setSearch,
  };
}
