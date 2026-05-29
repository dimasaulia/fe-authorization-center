"use client";

import { useState } from "react";
import { useAuth } from "@/modules/opensuite-sdk";
import { DEFAULTS } from "@/modules/opensuite-sdk/constants";

type LoginState = {
  isLoading: boolean;
  error: string | null;
};

export function useLoginController() {
  const { login } = useAuth();
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      setState({ isLoading: false, error: "Username dan password wajib diisi" });
      return;
    }

    setState({ isLoading: true, error: null });

    try {
      await login({ username, password });

      // Redirect after successful login
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") ?? DEFAULTS.DEFAULT_ROUTE;
      window.location.assign(redirectTo);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login gagal, silakan coba lagi";
      setState({ isLoading: false, error: message });
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return {
    isLoading: state.isLoading,
    error: state.error,
    handleSubmit,
    clearError,
  };
}
