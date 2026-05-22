"use client";

import { useCallback, useEffect, useState } from "react";

import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import {
  deleteExistingPermission,
  getPermissionsByApp,
} from "../../../modules/permissions/permissions.service";
import type { App } from "../../../modules/apps/apps.type";
import type { Permission } from "../../../modules/permissions/permissions.type";

export function useAppPermissionListController(appCode: string) {
  const { language, t } = usePreferences();
  const [app, setApp] = useState<App | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
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

          return getPermissionsByApp(
            appCode,
            { limit: 50, offset: 0, search: q },
            language,
          ).then((items) => {
            setPermissions(items);
            setIsLoading(false);
          });
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

  const confirmDelete = useCallback((id: number) => {
    setConfirmDeleteId(id);
  }, []);

  const cancelDelete = useCallback(() => {
    setConfirmDeleteId(null);
  }, []);

  const executeDelete = useCallback(() => {
    if (confirmDeleteId === null) return;
    const id = confirmDeleteId;

    setDeletingId(id);
    setConfirmDeleteId(null);

    deleteExistingPermission(id, language)
      .then(() => {
        setPermissions((prev) => prev.filter((p) => p.id !== id));
      })
      .catch(() => {
        setError(t("authz.permissionDelete.error"));
      })
      .finally(() => {
        setDeletingId(null);
      });
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
    permissions,
    search,
    setSearch,
  };
}
