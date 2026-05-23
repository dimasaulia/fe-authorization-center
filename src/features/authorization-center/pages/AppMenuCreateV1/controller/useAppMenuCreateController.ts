"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { getModulesByApp } from "../../../modules/modules/modules.service";
import { getPermissionsByApp } from "../../../modules/permissions/permissions.service";
import { bulkCreateNewMenus } from "../../../modules/menus/menus.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AppModule } from "../../../modules/modules/modules.type";
import type { Permission } from "../../../modules/permissions/permissions.type";
import type { AppMenuCreatePayload } from "../../../modules/menus/menus.type";

export type MenuRow = {
  id: string;
  module: { id: number; label: string; sublabel: string } | null;
  permission: { id: number; label: string; sublabel: string } | null;
  name: string;
  code: string;
  codeOverride: boolean;
  route_path: string;
  sort_order: number;
  status: "active" | "inactive";
};

function makeRow(): MenuRow {
  return {
    id: Math.random().toString(36).slice(2),
    module: null,
    permission: null,
    name: "",
    code: "",
    codeOverride: false,
    route_path: "",
    sort_order: 1,
    status: "active",
  };
}

export function useAppMenuCreateController(appCode: string) {
  const router = useRouter();
  const { language, t } = usePreferences();

  const [app, setApp] = useState<App | null>(null);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [moduleSearch, setModuleSearch] = useState("");
  const [permissionSearch, setPermissionSearch] = useState("");
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<MenuRow[]>([makeRow()]);

  useEffect(() => {
    let cancelled = false;

    getAppByCode(appCode, language)
      .then((appData) => {
        if (cancelled) return;
        setApp(appData);

        return Promise.all([
          getModulesByApp(appCode, { limit: 100, offset: 0, search: "" }, language),
          getPermissionsByApp(appCode, { limit: 100, offset: 0, search: "" }, language),
        ]).then(([mods, perms]) => {
          if (cancelled) return;
          setModules(mods);
          setPermissions(perms);
          setIsLoadingInit(false);
        });
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("common.error.loadFailed"));
          setIsLoadingInit(false);
        }
      });

    return () => { cancelled = true; };
  }, [appCode, language, t]);

  // Filtered lists
  const filteredModules = modules.filter(
    (m) =>
      m.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      m.code.toLowerCase().includes(moduleSearch.toLowerCase()),
  );

  const filteredPermissions = permissions.filter(
    (p) =>
      p.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
      p.code.toLowerCase().includes(permissionSearch.toLowerCase()),
  );

  const buildCode = useCallback(
    (row: MenuRow) => {
      if (row.codeOverride) return row.code;
      if (!app || !row.module) return "";
      const modSlug = row.module.sublabel.startsWith(`${app.code}.`)
        ? row.module.sublabel.slice(app.code.length + 1)
        : row.module.sublabel;
      const nameSlug = slugify(row.name);

      return nameSlug ? `${app.code}.${modSlug}.${nameSlug}` : `${app.code}.${modSlug}`;
    },
    [app],
  );

  const updateRow = useCallback(
    (id: string, patch: Partial<MenuRow>) => {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );
    },
    [],
  );

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, makeRow()]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Search permissions on demand
  const searchPermissions = useCallback(
    (q: string) => {
      setPermissionSearch(q);
      if (!app) return;
      getPermissionsByApp(appCode, { limit: 50, offset: 0, search: q }, language)
        .then((perms) => setPermissions(perms))
        .catch(() => {});
    },
    [app, appCode, language],
  );

  const submit = useCallback(async () => {
    if (!app) return;
    setIsSubmitting(true);
    setError(null);

    const payload: AppMenuCreatePayload[] = rows
      .filter((r) => r.module && r.name && r.route_path)
      .map((r) => ({
        app_id: app.id,
        module_id: r.module!.id,
        parent_id: null,
        code: buildCode(r),
        name: r.name,
        route_path: r.route_path,
        sort_order: r.sort_order,
        required_permission_id: r.permission?.id ?? null,
        status: r.status,
      }));

    if (payload.length === 0) {
      setError(t("authz.menuCreate.error"));
      setIsSubmitting(false);

      return;
    }

    try {
      await bulkCreateNewMenus(payload, language);
      router.push(routes.appMenus(appCode));
    } catch {
      setError(t("authz.menuCreate.error"));
      setIsSubmitting(false);
    }
  }, [app, rows, appCode, language, router, t, buildCode]);

  return {
    addRow,
    app,
    buildCode,
    error,
    filteredModules,
    filteredPermissions,
    isLoadingInit,
    isSubmitting,
    moduleSearch,
    permissionSearch,
    removeRow,
    rows,
    searchPermissions,
    setModuleSearch,
    submit,
    updateRow,
  };
}
