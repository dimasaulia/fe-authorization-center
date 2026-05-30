"use client";

import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

import { AuthCenterHeader } from "../../../authorization-center/components/AuthCenterHeader";
import { useUserEditController } from "./controller/useUserEditController";

type UserEditV1Props = {
  userId: string;
};

export function UserEditV1({ userId }: UserEditV1Props) {
  const { t } = usePreferences();
  const {
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
  } = useUserEditController(userId);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("users.edit.description")}
        title={t("users.edit.title")}
      />

      <div className="mx-auto max-w-xl">
        <form
          className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_3px_var(--dashboard-shadow)]"
          onSubmit={submit}
        >
          <div className="flex items-center gap-3 border-b border-[var(--dashboard-border-soft)] px-6 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-subtle)]">
              <AppIcon className="h-5 w-5" name="user" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--dashboard-text)]">
                {t("users.edit.formTitle")}
              </h2>
              <p className="text-xs text-[var(--dashboard-muted)]">
                {t("authz.form.required")}
              </p>
            </div>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
                {t("users.edit.userId")}
              </p>
              <p className="mt-1 font-mono text-sm text-[var(--dashboard-text)]">
                {userId}
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    className="h-11 animate-pulse rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)]"
                    key={item}
                  />
                ))}
              </div>
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                    {t("users.create.displayNameLabel")} <span className="text-red-500">*</span>
                  </span>
                  <input
                    autoFocus
                    className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder={t("users.create.displayNamePlaceholder")}
                    required
                    type="text"
                    value={displayName}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                    {t("users.create.usernameLabel")} <span className="text-red-500">*</span>
                  </span>
                  <input
                    className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder={t("users.create.usernamePlaceholder")}
                    required
                    type="text"
                    value={username}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                    {t("users.create.emailLabel")} <span className="text-red-500">*</span>
                  </span>
                  <input
                    className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t("users.create.emailPlaceholder")}
                    required
                    type="email"
                    value={email}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                    {t("users.edit.passwordLabel")}
                  </span>
                  <input
                    className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={t("users.edit.passwordPlaceholder")}
                    type="password"
                    value={password}
                  />
                  <p className="mt-1.5 text-xs text-[var(--dashboard-subtle)]">
                    {t("users.edit.passwordHelp")}
                  </p>
                </label>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    checked={mustChangePassword}
                    className="h-4 w-4 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                    onChange={(event) => setMustChangePassword(event.target.checked)}
                    type="checkbox"
                  />
                  <span className="text-sm text-[var(--dashboard-text)]">
                    {t("users.create.mustChangePassword")}
                  </span>
                </label>
              </>
            )}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[var(--dashboard-border-soft)] px-6 py-4">
            <button
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-5 text-sm font-semibold text-[var(--dashboard-muted-strong)] transition hover:bg-[var(--dashboard-panel-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              onClick={cancel}
              type="button"
            >
              {t("authz.form.cancel")}
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hero-border bg-hero px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading || isSubmitting || !username || !email || !displayName}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t("users.edit.saving")}
                </>
              ) : (
                t("authz.form.save")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
