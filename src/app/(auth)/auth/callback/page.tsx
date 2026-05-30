"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULTS, useAuth } from "@/modules/opensuite-sdk";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackShell />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeSsoLogin } = useAuth();
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  const code = searchParams.get("code");
  const callbackError = searchParams.get("error");
  const redirectTo = searchParams.get("redirect") ?? DEFAULTS.DEFAULT_ROUTE;
  const error = callbackError ?? (!code ? "Missing SSO callback code" : exchangeError);

  useEffect(() => {
    if (callbackError || !code) {
      return;
    }

    let cancelled = false;
    completeSsoLogin(code)
      .then(() => {
        if (!cancelled) {
          router.replace(redirectTo);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setExchangeError(err instanceof Error ? err.message : "SSO login failed");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [callbackError, code, completeSsoLogin, redirectTo, router]);

  return (
    <AuthCallbackShell
      action={error ? () => router.replace(DEFAULTS.LOGIN_ROUTE) : undefined}
      error={error}
    />
  );
}

function AuthCallbackShell({
  action,
  error,
}: {
  action?: () => void;
  error?: string | null;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--auth-page-from)] px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold text-[var(--auth-text)]">
          {error ? "SSO login failed" : "Signing you in"}
        </h1>
        <p className="mt-3 text-sm text-[var(--auth-muted)]">
          {error ?? "Please wait while your SSO session is completed."}
        </p>
        {error && action && (
          <button
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-[var(--auth-field-border)] px-5 text-sm font-semibold text-[var(--auth-text)]"
            onClick={action}
            type="button"
          >
            Back to login
          </button>
        )}
      </div>
    </main>
  );
}
