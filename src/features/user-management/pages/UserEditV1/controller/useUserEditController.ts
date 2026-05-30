"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import {
  getUserDetail,
  updateExistingUser,
} from "../../../modules/users/users.service";
import type { UserUpdatePayload } from "../../../modules/users/users.type";

export function useUserEditController(userId: string) {
  const { language, t } = usePreferences();
  const router = useRouter();
  const numericUserId = useMemo(() => Number(userId), [userId]);
  const isValidUserId = Number.isFinite(numericUserId);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(isValidUserId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    isValidUserId ? null : t("common.error.notFound"),
  );

  useEffect(() => {
    if (!isValidUserId) return;

    let isActive = true;

    getUserDetail(numericUserId, language)
      .then((user) => {
        if (!isActive) return;
        setUsername(user.username);
        setEmail(user.email);
        setDisplayName(user.display_name);
        setMustChangePassword(Boolean(user.must_change_password));
        setIsLoading(false);
      })
      .catch(() => {
        if (!isActive) return;
        setError(t("common.error.loadFailed"));
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [isValidUserId, language, numericUserId, t]);

  const submit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (!username || !email || !displayName || !isValidUserId) {
        setError(t("users.edit.error"));

        return;
      }

      setIsSubmitting(true);
      setError(null);

      const payload: UserUpdatePayload = {
        username,
        email,
        display_name: displayName,
        must_change_password: mustChangePassword,
      };

      if (password) {
        payload.password = password;
      }

      updateExistingUser(numericUserId, payload, language)
        .then(() => {
          router.push(routes.users);
        })
        .catch(() => {
          setError(t("users.edit.error"));
          setIsSubmitting(false);
        });
    },
    [
      displayName,
      email,
      language,
      mustChangePassword,
      numericUserId,
      password,
      router,
      t,
      username,
      isValidUserId,
    ],
  );

  const cancel = useCallback(() => {
    router.push(routes.users);
  }, [router]);

  return {
    cancel,
    displayName,
    email,
    error,
    isLoading,
    isSubmitting,
    mustChangePassword,
    password,
    setDisplayName,
    setEmail,
    setMustChangePassword,
    setPassword,
    setUsername,
    submit,
    username,
  };
}
