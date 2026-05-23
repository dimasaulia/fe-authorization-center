"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { slugify } from "@/shared/utils/slugify";

import { getRoleDetail, updateExistingRole } from "../../../modules/roles/roles.service";
import type { Role } from "../../../modules/roles/roles.type";

type UseRoleEditControllerProps = {
  roleId: string;
  returnPath: string;
};

export function useRoleEditController({ roleId, returnPath }: UseRoleEditControllerProps) {
  const router = useRouter();
  const { language, t } = usePreferences();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [codeOverride, setCodeOverride] = useState(false);
  const [description, setDescription] = useState("");
  const [isSystem, setIsSystem] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  useEffect(() => {
    let cancelled = false;

    getRoleDetail(Number(roleId), language)
      .then((data) => {
        if (cancelled) return;
        setRole(data);
        setName(data.name);
        setCode(data.code);
        setDescription(data.description);
        setIsSystem(data.is_system);
        setStatus(data.status);
        setIsLoadingInit(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("common.error.loadFailed"));
          setIsLoadingInit(false);
        }
      });

    return () => { cancelled = true; };
  }, [roleId, language, t]);

  const submit = useCallback(async () => {
    if (!role) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await updateExistingRole(
        role.id,
        { code, name, description, is_system: isSystem, status },
        language,
      );
      router.push(returnPath);
    } catch {
      setError(t("authz.roleEdit.error"));
      setIsSubmitting(false);
    }
  }, [role, code, name, description, isSystem, status, language, returnPath, router, t]);

  return {
    code,
    codeOverride,
    description,
    error,
    isLoadingInit,
    isSubmitting,
    isSystem,
    name,
    role,
    setCode,
    setCodeOverride,
    setDescription,
    setIsSystem,
    setName,
    setStatus,
    slugify,
    status,
    submit,
  };
}
