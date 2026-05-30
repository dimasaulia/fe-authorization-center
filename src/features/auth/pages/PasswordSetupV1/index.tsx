"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { usePasswordSetupController } from "./controller/usePasswordSetupController";

export function PasswordSetupV1() {
  const { t } = usePreferences();
  const {
    password, setPassword,
    confirm, setConfirm,
    isSubmitting,
    error,
    success,
    submit,
  } = usePasswordSetupController();

  const inputCls = "h-11 w-full rounded-xl border border-[var(--auth-field-border)] bg-[var(--auth-field)] px-3.5 text-sm text-[var(--auth-text)] outline-none placeholder:text-[var(--auth-placeholder)] focus:border-[var(--hero)] focus:ring-2 focus:ring-[var(--hero)]/20";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--auth-bg)] px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--auth-eyebrow)]">
            Open Suite
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--auth-heading)]">
            {t("passwordSetup.title")}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--auth-muted)]">
            {t("passwordSetup.description")}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--auth-card-border)] bg-[var(--auth-card)] p-8 shadow-[0_4px_24px_var(--auth-shadow)]">
          {success ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[var(--auth-text)]">
                {t("passwordSetup.success")}
              </p>
              <Link
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-hero-border bg-hero text-sm font-semibold text-white transition hover:bg-hero-hover"
                href={routes.login}
              >
                {t("passwordSetup.backToLogin")}
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {/* New password */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[var(--auth-label)]">
                  {t("passwordSetup.passwordLabel")} <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputCls}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void submit();
                    }
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordSetup.passwordPlaceholder")}
                  required
                  type="password"
                  value={password}
                />
              </label>

              {/* Confirm password */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[var(--auth-label)]">
                  {t("passwordSetup.confirmLabel")} <span className="text-red-500">*</span>
                </span>
                <input
                  className={inputCls}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void submit();
                    }
                  }}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder={t("passwordSetup.confirmPlaceholder")}
                  required
                  type="password"
                  value={confirm}
                />
              </label>

              {/* Error */}
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-hero-border bg-hero text-sm font-semibold text-white shadow-[0_4px_14px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting

                }
                onClick={() => void submit()}
                type="button"
              >
                {isSubmitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {t("passwordSetup.submit")}
              </button>

              {/* Back to login */}
              <div className="text-center">
                <Link
                  className="text-sm text-[var(--auth-muted)] hover:text-[var(--auth-text)] hover:underline"
                  href={routes.login}
                >
                  {t("passwordSetup.backToLogin")}
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[var(--auth-muted)]">
          Protected by Open Suite SSO and network policy.
        </p>
      </div>
    </main>
  );
}
