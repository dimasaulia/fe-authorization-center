"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { getAppByCode } from "../../../modules/apps/apps.service";
import {
  bulkCreateNewRolePermissions,
  getAvailablePermissionsByApp,
} from "../../../modules/role-permissions/role-permissions.service";
import { getRolesByApp } from "../../../modules/roles/roles.service";
import type { App } from "../../../modules/apps/apps.type";
import type { AvailablePermissionModule } from "../../../modules/role-permissions/role-permissions.type";

type SearchDropdownOption = {
  id: number;
  label: string;
  sublabel?: string;
};

export type RolePermissionRow = {
  roleId: number;
  roleValue: SearchDropdownOption | null;
  roleOptions: SearchDropdownOption[];
  roleOptionsLoading: boolean;
  permissionIds: number[];
  permissionSearch: string;
};

export function useAppRolePermissionCreateController(appCode: string) {
  const { language, t } = usePreferences();
  const router = useRouter();

  const [app, setApp] = useState<App | null>(null);
  const [availableModules, setAvailableModules] = useState<AvailablePermissionModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const roleSearchTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const [rows, setRows] = useState<RolePermissionRow[]>([
    {
      roleId: 0,
      roleValue: null,
      roleOptions: [],
      roleOptionsLoading: false,
      permissionIds: [],
      permissionSearch: "",
    },
  ]);

  // Initial load: app + available permissions
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
      setLoadError(null);

      Promise.all([
        getAppByCode(appCode, language),
        getAvailablePermissionsByApp(appCode, language),
      ])
        .then(([appData, modules]) => {
          setApp(appData);
          setAvailableModules(modules);
          setIsLoading(false);
        })
        .catch(() => {
          setLoadError(t("common.error.loadFailed"));
          setIsLoading(false);
        });
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appCode, language]);

  // Fetch roles for a specific row with debounce
  const fetchRolesForRow = useCallback(
    (index: number, search: string) => {
      if (roleSearchTimers.current[index]) {
        clearTimeout(roleSearchTimers.current[index]);
      }

      setRows((prev) =>
        prev.map((row, i) =>
          i === index ? { ...row, roleOptionsLoading: true } : row,
        ),
      );

      roleSearchTimers.current[index] = setTimeout(() => {
        getRolesByApp(appCode, { limit: 20, offset: 0, search }, language)
          .then((items) => {
            const options: SearchDropdownOption[] = items.map((r) => ({
              id: r.id,
              label: r.name,
              sublabel: r.code,
            }));

            setRows((prev) =>
              prev.map((row, i) =>
                i === index
                  ? { ...row, roleOptions: options, roleOptionsLoading: false }
                  : row,
              ),
            );
          })
          .catch(() => {
            setRows((prev) =>
              prev.map((row, i) =>
                i === index ? { ...row, roleOptionsLoading: false } : row,
              ),
            );
          });
      }, 300);
    },
    [appCode, language],
  );

  // Trigger initial fetch for row 0 on mount
  useEffect(() => {
    const timer = setTimeout(() => fetchRolesForRow(0, ""), 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appCode, language]);

  // Row management
  const addRow = useCallback(() => {
    setRows((prev) => {
      const newIndex = prev.length;

      setTimeout(() => fetchRolesForRow(newIndex, ""), 0);

      return [
        ...prev,
        {
          roleId: 0,
          roleValue: null,
          roleOptions: [],
          roleOptionsLoading: false,
          permissionIds: [],
          permissionSearch: "",
        },
      ];
    });
  }, [fetchRolesForRow]);

  const removeRow = useCallback((index: number) => {
    if (roleSearchTimers.current[index]) {
      clearTimeout(roleSearchTimers.current[index]);
      delete roleSearchTimers.current[index];
    }

    setRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Called by SearchDropdown onSearch
  const handleRoleSearch = useCallback(
    (index: number, q: string) => {
      fetchRolesForRow(index, q);
    },
    [fetchRolesForRow],
  );

  // Called by SearchDropdown onSelect
  const handleRoleSelect = useCallback(
    (index: number, option: SearchDropdownOption) => {
      setRows((prev) =>
        prev.map((row, i) =>
          i === index
            ? {
                ...row,
                roleId: option.id,
                roleValue: option.id === 0 ? null : option,
              }
            : row,
        ),
      );
    },
    [],
  );

  const setRowPermissionSearch = useCallback((index: number, search: string) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, permissionSearch: search } : row,
      ),
    );
  }, []);

  const togglePermission = useCallback((index: number, permissionId: number) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const has = row.permissionIds.includes(permissionId);

        return {
          ...row,
          permissionIds: has
            ? row.permissionIds.filter((id) => id !== permissionId)
            : [...row.permissionIds, permissionId],
        };
      }),
    );
  }, []);

  const toggleModulePermissions = useCallback(
    (index: number, modulePermissionIds: number[]) => {
      setRows((prev) =>
        prev.map((row, i) => {
          if (i !== index) return row;
          const allSelected = modulePermissionIds.every((id) =>
            row.permissionIds.includes(id),
          );

          if (allSelected) {
            return {
              ...row,
              permissionIds: row.permissionIds.filter(
                (id) => !modulePermissionIds.includes(id),
              ),
            };
          }

          return {
            ...row,
            permissionIds: Array.from(
              new Set([...row.permissionIds, ...modulePermissionIds]),
            ),
          };
        }),
      );
    },
    [],
  );

  // Duplicate role validation
  const isDuplicateRole = useCallback(
    (index: number) => {
      const roleId = rows[index]?.roleId;

      if (!roleId) return false;

      return rows.some((r, i) => i !== index && r.roleId === roleId);
    },
    [rows],
  );

  const hasDuplicates = rows
    .map((r) => r.roleId)
    .some((id, idx, arr) => id > 0 && arr.indexOf(id) !== idx);

  const submit = useCallback(() => {
    const validRows = rows.filter(
      (r) => r.roleId > 0 && r.permissionIds.length > 0,
    );

    if (validRows.length === 0 || hasDuplicates) {
      setSubmitError(t("authz.rolePermissionCreate.error"));

      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = validRows.map((r) => ({
      role_id: r.roleId,
      permission_id: r.permissionIds,
    }));

    bulkCreateNewRolePermissions(payload, language)
      .then(() => {
        router.push(routes.appRolePermissions(appCode));
      })
      .catch(() => {
        setSubmitError(t("authz.rolePermissionCreate.error"));
        setIsSubmitting(false);
      });
  }, [rows, hasDuplicates, language, t, router, appCode]);

  const cancel = useCallback(() => {
    router.push(routes.appRolePermissions(appCode));
  }, [router, appCode]);

  return {
    app,
    availableModules,
    rows,
    isLoading,
    loadError,
    isSubmitting,
    submitError,
    addRow,
    removeRow,
    handleRoleSearch,
    handleRoleSelect,
    setRowPermissionSearch,
    togglePermission,
    toggleModulePermissions,
    isDuplicateRole,
    submit,
    cancel,
  };
}
