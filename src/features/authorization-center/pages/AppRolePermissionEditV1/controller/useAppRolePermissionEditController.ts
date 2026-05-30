"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import {
  getAvailablePermissionsByApp,
  getRolePermissionsByRole,
  updateExistingRolePermissionsByRole,
} from "../../../modules/role-permissions/role-permissions.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AvailablePermissionModule } from "../../../modules/role-permissions/role-permissions.type";

type RoleInfo = {
  id: number;
  code: string;
  name: string;
  scope: string;
};

export function useAppRolePermissionEditController(appCode: string, roleCode: string) {
  const { language, t } = usePreferences();
  const router = useRouter();

  const [app, setApp] = useState<App | null>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [availableModules, setAvailableModules] = useState<AvailablePermissionModule[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [permissionSearch, setPermissionSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      setLoadError(null);

      Promise.all([
        getAppByCode(appCode, language),
        getAvailablePermissionsByApp(appCode, language),
        getRolePermissionsByRole(roleCode, language),
      ])
        .then(([appData, modules, existingRolePerms]) => {
          setApp(appData);
          setAvailableModules(modules);

          // Extract role info from first item (all items share same role)
          const first = existingRolePerms[0];

          if (first) {
            setRoleInfo({
              id: first.role_id,
              code: roleCode,
              name: roleCode, // will be overridden below if summary available
              scope: "",
            });
          }

          // Filter existing role permissions to only those belonging to this app
          const appPermIds = existingRolePerms
            .filter((rp) => rp.app_code === appCode)
            .map((rp) => rp.permission_id);

          setSelectedPermissionIds(appPermIds);
          setIsLoading(false);
        })
        .catch(() => {
          setLoadError(t("common.error.loadFailed"));
          setIsLoading(false);
        });
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appCode, roleCode, language]);

  // Also fetch role summaries to get proper role name/scope
  useEffect(() => {
    const timer = setTimeout(() => {
      import("../../../modules/role-permissions/role-permissions.service")
        .then(({ getRoleSummariesByApp }) => getRoleSummariesByApp(appCode, language))
        .then((summaries) => {
          const match = summaries.find((s) => s.role_code === roleCode);

          if (match) {
            setRoleInfo({
              id: match.role_id,
              code: match.role_code,
              name: match.role_name,
              scope: match.role_scope,
            });
          }
        })
        .catch(() => {
          // non-critical, role info display only
        });
    }, 0);

    return () => clearTimeout(timer);
  }, [appCode, roleCode, language]);

  const togglePermission = useCallback((permissionId: number) => {
    setSelectedPermissionIds((prev) => {
      const has = prev.includes(permissionId);

      return has ? prev.filter((id) => id !== permissionId) : [...prev, permissionId];
    });
  }, []);

  const toggleModulePermissions = useCallback((modulePermissionIds: number[]) => {
    setSelectedPermissionIds((prev) => {
      const allSelected = modulePermissionIds.every((id) => prev.includes(id));

      if (allSelected) {
        return prev.filter((id) => !modulePermissionIds.includes(id));
      }

      return Array.from(new Set([...prev, ...modulePermissionIds]));
    });
  }, []);

  const toggleAll = useCallback(() => {
    const allPermIds = availableModules.flatMap((m) => m.permissions.map((p) => p.id));
    const allSelected = allPermIds.every((id) => selectedPermissionIds.includes(id));

    if (allSelected) {
      setSelectedPermissionIds([]);
    } else {
      setSelectedPermissionIds(allPermIds);
    }
  }, [availableModules, selectedPermissionIds]);

  // Filtered modules for local permission search
  const filteredModules = availableModules
    .map((mod) => ({
      ...mod,
      permissions: mod.permissions.filter((p) => {
        const q = permissionSearch.toLowerCase().trim();

        return q === "" || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      }),
    }))
    .filter((mod) => mod.permissions.length > 0);

  const allPermIds = availableModules.flatMap((m) => m.permissions.map((p) => p.id));
  const allSelected = allPermIds.length > 0 && allPermIds.every((id) => selectedPermissionIds.includes(id));

  const submit = useCallback(() => {
    if (!roleInfo || !app) return;

    setIsSubmitting(true);
    setSubmitError(null);

    updateExistingRolePermissionsByRole(
      roleInfo.id,
      {
        permission: [
          {
            app_id: app.id,
            permission_id: selectedPermissionIds,
          },
        ],
        effect: "allow",
      },
      language,
    )
      .then(() => {
        router.push(routes.appRolePermissions(appCode));
      })
      .catch(() => {
        setSubmitError(t("authz.rolePermissionEdit.error"));
        setIsSubmitting(false);
      });
  }, [roleInfo, app, selectedPermissionIds, language, t, router, appCode]);

  const cancel = useCallback(() => {
    router.push(routes.appRolePermissions(appCode));
  }, [router, appCode]);

  return {
    app,
    roleInfo,
    availableModules,
    filteredModules,
    selectedPermissionIds,
    permissionSearch,
    setPermissionSearch,
    allSelected,
    allPermIds,
    isLoading,
    loadError,
    isSubmitting,
    submitError,
    togglePermission,
    toggleModulePermissions,
    toggleAll,
    submit,
    cancel,
  };
}
