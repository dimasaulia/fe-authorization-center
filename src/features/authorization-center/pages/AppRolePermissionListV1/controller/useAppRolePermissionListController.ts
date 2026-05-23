"use client";

import { useCallback, useEffect, useState } from "react";

import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import {
  deleteExistingRolePermission,
  getRolePermissionsByApp,
  getRoleSummariesByApp,
} from "../../../modules/role-permissions/role-permissions.service";
import { getRolesByApp } from "../../../modules/roles/roles.service";
import type { App } from "../../../modules/apps/apps.type";
import type {
  RolePermission,
  RoleSummary,
} from "../../../modules/role-permissions/role-permissions.type";
import type { Role } from "../../../modules/roles/roles.type";

export function useAppRolePermissionListController(appCode: string) {
  const { language, t } = usePreferences();

  const [app, setApp] = useState<App | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [roleSummaries, setRoleSummaries] = useState<RoleSummary[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      getAppByCode(appCode, language),
      getRolePermissionsByApp(appCode, language),
      getRoleSummariesByApp(appCode, language),
      getRolesByApp(appCode, {}, language),
    ])
      .then(([appData, rps, summaries, appRoles]) => {
        setApp(appData);
        setRolePermissions(rps);
        setRoleSummaries(summaries);
        setRoles(appRoles);
        setIsLoading(false);
      })
      .catch(() => {
        setError(t("common.error.loadFailed"));
        setIsLoading(false);
      });
  }, [appCode, language, t]);

  useEffect(() => {
    const timer = setTimeout(() => load(), 0);

    return () => clearTimeout(timer);
  }, [load]);

  const confirmDelete = useCallback((id: number) => setConfirmDeleteId(id), []);
  const cancelDelete = useCallback(() => setConfirmDeleteId(null), []);

  const executeDelete = useCallback(() => {
    if (confirmDeleteId === null) return;
    const id = confirmDeleteId;

    setDeletingId(id);
    setConfirmDeleteId(null);

    deleteExistingRolePermission(id, language)
      .then(() => {
        setRolePermissions((prev) => prev.filter((rp) => rp.id !== id));
        setRoleSummaries((prev) =>
          prev.map((s) => {
            const removed = rolePermissions.find((rp) => rp.id === id);

            if (removed && s.role_id === removed.role_id) {
              return { ...s, permission_count: Math.max(0, s.permission_count - 1) };
            }

            return s;
          }),
        );
      })
      .catch(() => setError(t("authz.rolePermissionDelete.error")))
      .finally(() => setDeletingId(null));
  }, [confirmDeleteId, language, rolePermissions, t]);

  return {
    app,
    cancelDelete,
    confirmDelete,
    confirmDeleteId,
    deletingId,
    error,
    executeDelete,
    isLoading,
    rolePermissions,
    roles,
    roleSummaries,
  };
}
