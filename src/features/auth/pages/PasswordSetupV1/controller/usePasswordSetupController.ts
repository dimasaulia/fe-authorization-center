"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

export function usePasswordSetupController() {
  const { language, t } = usePreferences();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!code) {
        setError(t("passwordSetup.invalidCode"));

        return;
      }

      if (password !== confirm) {
        setError(t("passwordSetup.mismatch"));

        return;
      }

      setIsSubmitting(true);
      setError(null);

      // Backend endpoint not yet implemented — UI placeholder
      // When ready: call POST /api/v1/users/password-setup with { code, password }
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setSuccess(true);
      } catch {
        setError(t("passwordSetup.error"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [code, password, confirm, t],
  );

  const goToLogin = useCallback(() => {
    router.push(routes.login);
  }, [router]);

  return {
    code,
    password, setPassword,
    confirm, setConfirm,
    isSubmitting,
    error,
    success,
    submit,
    goToLogin,
  };
}
