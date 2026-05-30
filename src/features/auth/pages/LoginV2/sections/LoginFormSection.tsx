"use client";

import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";
import { Divider } from "@/shared/components/Divider";
import { FormField } from "@/shared/components/FormField";
import { LanguageToggle } from "@/shared/components/LanguageToggle";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

import { SsoButton } from "../components/SsoButton";
import { loginV2Fields } from "../constants/login-fields.constant";
import { useLoginController } from "../controller/useLoginController";

export function LoginFormSection() {
  const { t } = usePreferences();
  const { isLoading, error, handleSubmit, handleSsoLogin, clearError } = useLoginController();

  return (
    <section className="relative flex h-full flex-1 flex-col justify-center bg-[var(--auth-card)] px-6 py-10 sm:px-12 lg:px-16 lg:py-14">
      <div className="absolute right-6 top-6 flex flex-wrap justify-end gap-2 sm:right-8 lg:right-10 lg:top-8">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-7">
        <header className="flex flex-col gap-2.5 pt-10 sm:pt-0">
          <p className="text-sm font-medium leading-[18px] text-[var(--auth-muted)]">
            {t("login.workspace")}
          </p>
          <h1 className="text-[34px] font-semibold leading-[1.12] text-hero">
            {t("login.title")}
          </h1>
          <p className="text-[15px] leading-[1.5] text-[var(--auth-muted)]">
            {t("login.subtitle")}
          </p>
        </header>

        {error && (
          <div
            className="flex items-center gap-3 rounded-xl border border-red-200/60 bg-red-50/50 px-4 py-3.5 text-[13px] leading-[1.4] text-red-600 dark:border-red-500/20 dark:bg-red-950/20 dark:text-red-400"
            role="alert"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
            </svg>
            <span className="flex-1">{error}</span>
            <button
              aria-label="Dismiss"
              className="shrink-0 rounded-lg p-1 transition hover:bg-red-100 dark:hover:bg-red-900/30"
              onClick={clearError}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {loginV2Fields.map((field) => (
            <FormField
              autoComplete={field.autoComplete}
              defaultValue={field.defaultValue}
              id={`login-v2-${field.name}`}
              key={field.name}
              label={t(field.labelKey)}
              name={field.name}
              placeholder={t(field.placeholderKey)}
              type={field.type}
            />
          ))}
          <Button disabled={isLoading} fullWidth type="submit">
            {isLoading ? t("login.loading") : t("login.submit")}
          </Button>
        </form>

        <Divider label={t("login.divider")} />
        <SsoButton label={t("login.sso")} onClick={handleSsoLogin} />

        <div className="flex items-center gap-2">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--auth-success)]" />
          <p className="text-xs leading-4 text-[var(--auth-subtle)]">
            {t("login.protected")}
          </p>
        </div>
      </div>
    </section>
  );
}
