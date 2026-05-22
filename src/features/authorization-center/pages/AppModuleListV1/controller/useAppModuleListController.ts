"use client";

import { useCallback, useEffect, useState } from "react";

import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { deleteExistingModule, getModules } from "../../../modules/modules/modules.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AppModule } from "../../../modules/modules/modules.type";

export function useAppModuleListController(appCode: string) {
  const { language, t } = usePreferences();
  const [app, setApp] = useState<App | null>(null);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const load = useCallback(
    (q: string) => {
      getAppByCode(appCode, language)
        .then((appData) => {
          setApp(appData);

          return getModules({ limit: 20, offset: 0, search: q }, language).then(
            (items) => {
              setModules(items.filter((m) => m.app_id === appData.id));
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

    deleteExistingModule(id, language)
      .then(() => {
        setModules((prev) => prev.filter((m) => m.id !== id));
      })
      .catch(() => {
        setError(t("authz.moduleDelete.error"));
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
    isLoading,
    modules,
    executeDelete,
    search,
    setSearch,
  };
}
