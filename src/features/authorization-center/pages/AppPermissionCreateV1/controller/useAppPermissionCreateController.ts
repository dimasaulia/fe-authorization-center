"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { getModulesByApp } from "../../../modules/modules/modules.service";
import { getActions } from "../../../modules/actions/actions.service";
import { bulkCreateNewPermissions } from "../../../modules/permissions/permissions.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AppModule } from "../../../modules/modules/modules.type";
import type { Action } from "../../../modules/actions/actions.type";
import type { PermissionCreatePayload } from "../../../modules/permissions/permissions.type";

export type PermissionRow = {
  id: string;
  module: { id: number; label: string; sublabel: string } | null;
  action: { id: number; label: string; sublabel: string } | null;
  name: string;
  description: string;
  risk_level: "low" | "medium" | "high" | "critical";
  is_system: boolean;
  status: "active" | "inactive";
  codeOverride: string | null;
};

function makeRow(): PermissionRow {
  return {
    id: Math.random().toString(36).slice(2),
    module: null,
    action: null,
    name: "",
    description: "",
    risk_level: "low",
    is_system: false,
    status: "active",
    codeOverride: null,
  };
}

export function useAppPermissionCreateController(appCode: string) {
  const router = useRouter();
  const { language, t } = usePreferences();

  const [app, setApp] = useState<App | null>(null);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [moduleSearch, setModuleSearch] = useState("");
  const [actionSearch, setActionSearch] = useState("");
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PermissionRow[]>([makeRow()]);

  useEffect(() => {
    let cancelled = false;

    getAppByCode(appCode, language)
      .then((appData) => {
        if (cancelled) return;
        setApp(appData);

        return Promise.all([
          getModulesByApp(appCode, { limit: 100, offset: 0, search: "" }, language),
          getActions({ search: "" }, language),
        ]).then(([mods, acts]) => {
          if (cancelled) return;
          setModules(mods);
          setActions(acts);
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

  const filteredModules = modules.filter(
    (m) =>
      m.name.toLowerCase().includes(moduleSearch.toLowerCase()) ||
      m.code.toLowerCase().includes(moduleSearch.toLowerCase()),
  );

  const filteredActions = actions.filter(
    (a) =>
      a.name.toLowerCase().includes(actionSearch.toLowerCase()) ||
      a.code.toLowerCase().includes(actionSearch.toLowerCase()),
  );

  const buildCode = useCallback(
    (row: PermissionRow) => {
      if (row.codeOverride !== null) return row.codeOverride;
      if (!app || !row.module || !row.action) return "";
      const modSlug = row.module.sublabel.startsWith(`${app.code}.`)
        ? row.module.sublabel.slice(app.code.length + 1)
        : row.module.sublabel;

      return `${app.code}.${modSlug}.${slugify(row.action.sublabel)}`;
    },
    [app],
  );

  const updateRow = useCallback(
    (id: string, patch: Partial<PermissionRow>) => {
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

  const submit = useCallback(async () => {
    if (!app) return;
    setIsSubmitting(true);
    setError(null);

    const payload: PermissionCreatePayload[] = rows
      .filter((r) => r.module && r.action && r.name)
      .map((r) => ({
        app_id: app.id,
        module_id: r.module!.id,
        action_id: r.action!.id,
        code: buildCode(r),
        name: r.name,
        description: r.description,
        risk_level: r.risk_level,
        is_system: r.is_system,
        status: r.status,
      }));

    if (payload.length === 0) {
      setError(t("authz.permissionCreate.error"));
      setIsSubmitting(false);

      return;
    }

    try {
      await bulkCreateNewPermissions(payload, language);
      router.push(routes.appPermissions(appCode));
    } catch {
      setError(t("authz.permissionCreate.error"));
      setIsSubmitting(false);
    }
  }, [app, rows, appCode, language, router, t, buildCode]);

  return {
    actions: filteredActions,
    actionSearch,
    addRow,
    app,
    buildCode,
    error,
    isLoadingInit,
    isSubmitting,
    modules: filteredModules,
    moduleSearch,
    removeRow,
    rows,
    setActionSearch,
    setModuleSearch,
    submit,
    updateRow,
  };
}
