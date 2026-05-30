"use client";

import { useCallback, useEffect, useState } from "react";

import { usePreferences } from "@/modules/preferences";

import {
  deleteExistingUser,
  getUsers,
  resendInvitation,
} from "../../../modules/users/users.service";
import type { User } from "../../../modules/users/users.type";

export function useUserListController() {
  const { language, t } = usePreferences();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [resendingId, setResendingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const load = useCallback(
    (q: string) => {
      setIsLoading(true);
      setError(null);
      setNotice(null);

      getUsers({ limit: 20, offset: 0, search: q }, language)
        .then((items) => {
          setUsers(items);
          setIsLoading(false);
        })
        .catch(() => {
          setError(t("common.error.loadFailed"));
          setIsLoading(false);
        });
    },
    [language, t],
  );

  useEffect(() => {
    const timer = setTimeout(() => load(search), 300);

    return () => clearTimeout(timer);
  }, [search, load]);

  const confirmDelete = useCallback((id: number) => {
    setConfirmDeleteId(id);
  }, []);

  const cancelDelete = useCallback(() => {
    setConfirmDeleteId(null);
  }, []);

  const executeDelete = useCallback(() => {
    if (confirmDeleteId === null) return;
    const id = confirmDeleteId;

    setDeletingId(id);
    setConfirmDeleteId(null);
    setError(null);
    setNotice(null);

    deleteExistingUser(id, language)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        setNotice(t("users.delete.success"));
      })
      .catch(() => {
        setError(t("users.delete.error"));
      })
      .finally(() => {
        setDeletingId(null);
      });
  }, [confirmDeleteId, language, t]);

  const resendUserInvitation = useCallback(
    (id: number) => {
      setResendingId(id);
      setError(null);
      setNotice(null);

      resendInvitation(id, language)
        .then(() => {
          setNotice(t("users.invitation.resendSuccess"));
        })
        .catch(() => {
          setError(t("users.invitation.resendError"));
        })
        .finally(() => {
          setResendingId(null);
        });
    },
    [language, t],
  );

  return {
    cancelDelete,
    confirmDelete,
    confirmDeleteId,
    deletingId,
    error,
    executeDelete,
    isLoading,
    notice,
    resendUserInvitation,
    resendingId,
    users,
    search,
    setSearch,
  };
}
