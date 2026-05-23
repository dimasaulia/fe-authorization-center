"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { getModulesByApp } from "../../../modules/modules/modules.service";
import { getPermissionsByApp } from "../../../modules/permissions/permissions.service";
import { getMenuDetail, updateExistingMenu } from "../../../modules/menus/menus.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AppModule } from "../../../modules/modules/modules.type";
import type { Permission } from "../../../modules/permissions/permissions.type";
import type { AppMenu, AppMenuUpdatePayload } from "../../../modules/menus/menus.type";

export function useAppMenuEditController(appCode: string, menuId: string) {
  const router = useRouter();
  const { language, t } = usePreferences();

  const [app, setApp] = useState<App | null>(null);
  const [menu, setMenu] = useState<AppMenu | null>(null);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [routePath, setRoutePath] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [code, setCode] = useState("");
  const [codeOverride, setCodeOverride] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [selectedModule, setSelectedModule] = useState<{ id: number; label: string; sublabel: string } | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<{ id: number; label: string; sublabel: string } | null>(null);
  const [moduleSearch, setModuleSearch] = useState("");
  const [permissionSearch, setPermissionSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getAppByCode(appCode, language),
      getMenuDetail(Number(menuId), language),
    ])
      .then(([appData, menuData]) => {
        if (cancelled) return;

        return Promise.all([
          getModulesByApp(appCode, { limit: 100, offset: 0, search: "" }, language),
          getPermissionsByApp(appCode, { limit: 100, offset: 0, search: "" }, language),
        ]).then(([mods, perms]) => {
          if (cancelled) return;

          const menuModule = mods.find((m) => m.id === menuData.module_id);
          const menuPermission = menuData.required_permission_id
            ? perms.find((p) => p.id === menuData.required_permission_id)
            : null;

          setApp(appData);
          setMenu(menuData);
          setModules(mods);
          setPermissions(perms);

          // Pre-fill form
          setName(menuData.name);
          setRoutePath(menuData.route_path);
          setSortOrder(menuData.sort_order);
          setCode(menuData.code);
          setStatus(menuData.status);

          if (menuModule) {
            setSelectedModule({
              id: menuModule.id,
              label: menuModule.name,
              sublabel: menuModule.code,
            });
          }

          if (menuPermission) {
            setSelectedPermission({
              id: menuPermission.id,
              label: menuPermission.name,
              sublabel: menuPermission.code,
            });
          }

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
  }, [appCode, menuId, language, t]);

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

  const autoCode =
    app && selectedModule && name
      ? (() => {
          const modSlug = selectedModule.sublabel.startsWith(`${app.code}.`)
            ? selectedModule.sublabel.slice(app.code.length + 1)
            : selectedModule.sublabel;
          const nameSlug = slugify(name);

          return nameSlug ? `${app.code}.${modSlug}.${nameSlug}` : `${app.code}.${modSlug}`;
        })()
      : "";

  const displayCode = codeOverride ? code : autoCode || code;

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
    if (!menu || !selectedModule) return;
    setIsSubmitting(true);
    setError(null);

    const payload: AppMenuUpdatePayload = {
      module_id: selectedModule.id,
      parent_id: menu.parent_id,
      code: displayCode,
      name,
      route_path: routePath,
      sort_order: sortOrder,
      required_permission_id: selectedPermission?.id ?? null,
      status,
    };

    try {
      await updateExistingMenu(menu.id, payload, language);
      router.push(routes.appMenus(appCode));
    } catch {
      setError(t("authz.menuEdit.error"));
      setIsSubmitting(false);
    }
  }, [menu, selectedModule, selectedPermission, displayCode, name, routePath, sortOrder, status, appCode, language, router, t]);

  return {
    app,
    autoCode,
    code,
    codeOverride,
    displayCode,
    error,
    filteredModules,
    filteredPermissions,
    isLoadingInit,
    isSubmitting,
    menu,
    moduleSearch,
    name,
    permissionSearch,
    routePath,
    searchPermissions,
    selectedModule,
    selectedPermission,
    setCode,
    setCodeOverride,
    setModuleSearch,
    setName,
    setRoutePath,
    setSelectedModule,
    setSelectedPermission,
    setSortOrder,
    setStatus,
    sortOrder,
    status,
    submit,
  };
}
