"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import { getModulesByApp } from "../../../modules/modules/modules.service";
import { getActions } from "../../../modules/actions/actions.service";
import {
  getPermissionDetail,
  updateExistingPermission,
} from "../../../modules/permissions/permissions.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AppModule } from "../../../modules/modules/modules.type";
import type { Action } from "../../../modules/actions/actions.type";
import type { Permission, PermissionUpdatePayload } from "../../../modules/permissions/permissions.type";

export function useAppPermissionEditController(
  appCode: string,
  permissionId: string,
) {
  const router = useRouter();
  const { language, t } = usePreferences();

  const [app, setApp] = useState<App | null>(null);
  const [permission, setPermission] = useState<Permission | null>(null);
  const [modules, setModules] = useState<AppModule[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [moduleSearch, setModuleSearch] = useState("");
  const [actionSearch, setActionSearch] = useState("");
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [codeOverride, setCodeOverride] = useState(false);
  const [riskLevel, setRiskLevel] = useState<PermissionUpdatePayload["risk_level"]>("low");
  const [isSystem, setIsSystem] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [selectedModule, setSelectedModule] = useState<{ id: number; label: string; sublabel: string } | null>(null);
  const [selectedAction, setSelectedAction] = useState<{ id: number; label: string; sublabel: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getAppByCode(appCode, language),
      getPermissionDetail(Number(permissionId), language),
      getActions({ search: "" }, language),
    ])
      .then(([appData, perm, acts]) => {
        if (cancelled) return;

        return getModulesByApp(appCode, { limit: 100, offset: 0, search: "" }, language).then(
          (mods) => {
            if (cancelled) return;

            const permModule = mods.find((m) => m.id === perm.module_id);
            const permAction = acts.find((a) => a.id === perm.action_id);

            setApp(appData);
            setPermission(perm);
            setModules(mods);
            setActions(acts);

            setName(perm.name);
            setDescription(perm.description);
            setCode(perm.code);
            setRiskLevel(perm.risk_level);
            setIsSystem(perm.is_system);
            setStatus(perm.status);

            if (permModule) {
              setSelectedModule({
                id: permModule.id,
                label: permModule.name,
                sublabel: permModule.code,
              });
            }

            if (permAction) {
              setSelectedAction({
                id: permAction.id,
                label: permAction.name,
                sublabel: permAction.code,
              });
            }

            setIsLoadingInit(false);
          },
        );
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("common.error.loadFailed"));
          setIsLoadingInit(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [appCode, permissionId, language, t]);

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

  const autoCode =
    app && selectedModule && selectedAction
      ? (() => {
          const modSlug = selectedModule.sublabel.startsWith(`${app.code}.`)
            ? selectedModule.sublabel.slice(app.code.length + 1)
            : selectedModule.sublabel;

          return `${app.code}.${modSlug}.${selectedAction.sublabel}`;
        })()
      : "";

  const displayCode = codeOverride ? code : autoCode || code;

  const submit = useCallback(
    async () => {
      if (!permission || !selectedModule || !selectedAction) return;
      setIsSubmitting(true);
      setError(null);

      const payload: PermissionUpdatePayload = {
        module_id: selectedModule.id,
        action_id: selectedAction.id,
        code: displayCode,
        name,
        description,
        risk_level: riskLevel,
        is_system: isSystem,
        status,
      };

      try {
        await updateExistingPermission(permission.id, payload, language);
        router.push(routes.appPermissions(appCode));
      } catch {
        setError(t("authz.permissionEdit.error"));
        setIsSubmitting(false);
      }
    },
    [
      permission, selectedModule, selectedAction, displayCode,
      name, description, riskLevel, isSystem, status,
      appCode, language, router, t,
    ],
  );

  return {
    actions: filteredActions,
    actionSearch,
    app,
    autoCode,
    code,
    codeOverride,
    description,
    displayCode,
    error,
    isLoadingInit,
    isSubmitting,
    isSystem,
    modules: filteredModules,
    moduleSearch,
    name,
    permission,
    riskLevel,
    selectedAction,
    selectedModule,
    setActionSearch,
    setCode,
    setCodeOverride,
    setDescription,
    setIsSystem,
    setModuleSearch,
    setName,
    setRiskLevel,
    setSelectedAction,
    setSelectedModule,
    setStatus,
    status,
    submit,
  };
}
