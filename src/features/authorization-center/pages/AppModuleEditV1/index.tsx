"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { useAppModuleEditController } from "./controller/useAppModuleEditController";

type AppModuleEditV1Props = {
  appId: string;
  moduleId: string;
};

export function AppModuleEditV1({ appId, moduleId }: AppModuleEditV1Props) {
  const { t } = usePreferences();
  const {
    app,
    name,
    setName,
    moduleSlug,
    setModuleSlug,
    codeOverride,
    setCodeOverride,
    status,
    setStatus,
    error,
    isLoadingApp,
    isSubmitting,
    slugify,
    submit,
  } = useAppModuleEditController(appId, moduleId);

  const appCodePrefix = app ? `${app.code}.` : "";
  const fullCode = `${appCodePrefix}${moduleSlug}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit({ code: fullCode, name, status });
  };

  if (isLoadingApp) {
    return (
      <div className="h-32 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]" />
    );
  }

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.moduleEdit.description")}
        title={app ? `${app.name} · ${t("authz.moduleEdit.title")}` : t("authz.moduleEdit.title")}
      />

      <div className="mx-auto max-w-xl">
        <form
          className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_3px_var(--dashboard-shadow)]"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[var(--dashboard-border-soft)] px-6 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-subtle)]">
              <AppIcon className="h-5 w-5" name="shield" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--dashboard-text)]">
                {t("authz.moduleEdit.formTitle")}
              </h2>
              <p className="text-xs text-[var(--dashboard-muted)]">
                {t("authz.form.required")}
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5 px-6 py-6">
            {/* Module Name */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                {t("authz.moduleCreate.nameLabel")}{" "}
                <span className="text-red-500">*</span>
              </span>
              <input
                autoFocus
                className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                onChange={(e) => {
                  setName(e.target.value);
                  if (!codeOverride) setModuleSlug(slugify(e.target.value));
                }}
                placeholder={t("authz.moduleCreate.namePlaceholder")}
                required
                type="text"
                value={name}
              />
            </label>

            {/* Module Code */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                {t("authz.moduleCreate.codeLabel")}{" "}
                <span className="text-red-500">*</span>
              </span>
              <div className="relative">
                <input
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 pr-16 font-mono text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  onChange={(e) => {
                    setCodeOverride(true);
                    setModuleSlug(slugify(e.target.value));
                  }}
                  placeholder="user-management"
                  required
                  type="text"
                  value={moduleSlug}
                />
                {!codeOverride && name.length > 0 && (
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[var(--dashboard-accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--dashboard-accent)]">
                    auto
                  </span>
                )}
              </div>
              {fullCode && (
                <p className="mt-1.5 font-mono text-xs text-[var(--dashboard-muted)]">
                  Full code:{" "}
                  <span className="text-[var(--dashboard-muted-strong)]">
                    {fullCode}
                  </span>
                </p>
              )}
              <p className="mt-1 text-xs text-[var(--dashboard-subtle)]">
                {t("authz.moduleCreate.codeHint")}
              </p>
            </label>

            {/* Status */}
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                Status
              </legend>
              <div className="flex gap-3">
                {(["active", "inactive"] as const).map((s) => (
                  <button
                    className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${
                      status === s
                        ? s === "active"
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-slate-300 bg-slate-50 text-slate-600"
                        : "border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-muted)] hover:border-[var(--dashboard-border)]"
                    }`}
                    key={s}
                    onClick={() => setStatus(s)}
                    type="button"
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${s === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
                    />
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--dashboard-border-soft)] px-6 py-4">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-5 text-sm font-semibold text-[var(--dashboard-muted-strong)] transition hover:bg-[var(--dashboard-panel-subtle)]"
              href={routes.appModules(appId)}
            >
              {t("authz.form.cancel")}
            </a>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hero-border bg-hero px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !name || !moduleSlug}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
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
