"use client";

import { useCallback, useEffect, useState } from "react";

import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { deleteExistingMenu, getMenusByApp } from "../../../modules/menus/menus.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AppMenu } from "../../../modules/menus/menus.type";

export function useAppMenuListController(appCode: string) {
  const { language, t } = usePreferences();
  const [app, setApp] = useState<App | null>(null);
  const [menus, setMenus] = useState<AppMenu[]>([]);
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

          return getMenusByApp(appCode, { limit: 50, offset: 0, search: q }, language).then(
            (items) => {
              setMenus(items);
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

    deleteExistingMenu(id, language)
      .then(() => {
        setMenus((prev) => prev.filter((m) => m.id !== id));
      })
      .catch(() => {
        setError(t("authz.menuDelete.error"));
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
    menus,
    search,
    setSearch,
  };
}
