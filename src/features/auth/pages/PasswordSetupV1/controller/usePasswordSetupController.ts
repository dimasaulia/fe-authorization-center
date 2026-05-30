"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { setupPassword } from "../service/password-setup.service";

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
    async () => {
      console.log("JALAN");
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

      try {
        await setupPassword({ code, password }, language);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("passwordSetup.error"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [code, password, confirm, language, t],
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
