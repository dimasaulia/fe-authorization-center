"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import type { TranslationKey } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";
import { SearchDropdown } from "@/shared/components/SearchDropdown";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { useAppPermissionEditController } from "./controller/useAppPermissionEditController";

type AppPermissionEditV1Props = {
  appId: string;
  permissionId: string;
};

const riskLevels = ["low", "medium", "high", "critical"] as const;

export function AppPermissionEditV1({ appId, permissionId }: AppPermissionEditV1Props) {
  const { t } = usePreferences();
  const {
    actions,
    app,
    autoCode,
    code,
    codeOverride,
    description,
    displayCode,
    error,
    isLoadingInit,
    isSubmitting,
    isSystem,
    modules,
    name,
    riskLevel,
    selectedAction,
    selectedModule,
    setActionSearch,
    setCode,
    setCodeOverride,
    setDescription,
    setIsSystem,
    setModuleSearch,
    setName,
    setRiskLevel,
    setSelectedAction,
    setSelectedModule,
    setStatus,
    status,
    submit,
  } = useAppPermissionEditController(appId, permissionId);

  if (isLoadingInit) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            className="h-24 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]"
            key={i}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.permissionEdit.description")}
        title={app ? `${app.name} · ${t("authz.permissionEdit.title")}` : t("authz.permissionEdit.title")}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="permissions" appId={appId} />

        <section className="flex-1">
          <div className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--dashboard-border-soft)] px-6 py-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-subtle)]">
                <AppIcon className="h-5 w-5" name="shield" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-[var(--dashboard-text)]">
                  {t("authz.permissionEdit.formTitle")}
                </h2>
                <p className="text-xs text-[var(--dashboard-muted)]">
                  {t("authz.form.required")}
                </p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {/* Module */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.permissionCreate.moduleLabel")} <span className="text-red-500">*</span>
                </span>
                <SearchDropdown
                  onSearch={setModuleSearch}
                  onSelect={(opt) => {
                    setSelectedModule(opt.id ? { id: opt.id, label: opt.label, sublabel: opt.sublabel ?? "" } : null);
                    setCodeOverride(false);
                  }}
                  options={modules.map((m) => ({ id: m.id, label: m.name, sublabel: m.code }))}
                  placeholder={t("authz.permissionCreate.moduleLabel")}
                  value={selectedModule}
                />
              </label>

              {/* Action */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.permissionCreate.actionLabel")} <span className="text-red-500">*</span>
                </span>
                <SearchDropdown
                  onSearch={setActionSearch}
                  onSelect={(opt) => {
                    setSelectedAction(opt.id ? { id: opt.id, label: opt.label, sublabel: opt.sublabel ?? "" } : null);
                    setCodeOverride(false);
                  }}
                  options={actions.map((a) => ({ id: a.id, label: a.name, sublabel: a.code }))}
                  placeholder={t("authz.permissionCreate.actionLabel")}
                  value={selectedAction}
                />
              </label>

              {/* Name */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.permissionCreate.nameLabel")} <span className="text-red-500">*</span>
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("authz.permissionCreate.namePlaceholder")}
                  type="text"
                  value={name}
                />
              </label>

              {/* Risk level */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.permissionCreate.riskLabel")}
                </span>
                <select
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  onChange={(e) => setRiskLevel(e.target.value as typeof riskLevel)}
                  value={riskLevel}
                >
                  {riskLevels.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              {/* Description */}
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.permissionCreate.descriptionLabel")}
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("authz.permissionCreate.descriptionPlaceholder")}
                  type="text"
                  value={description}
                />
              </label>

              {/* Code */}
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.permissionCreate.codeLabel")}
                </span>
                <div className="relative">
                  <input
                    className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 pr-16 font-mono text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeOverride(true);
                    }}
                    placeholder={autoCode || "app.module.action"}
                    type="text"
                    value={displayCode}
                  />
                  {!codeOverride && autoCode && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[var(--dashboard-accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--dashboard-accent)]">
                      auto
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--dashboard-subtle)]">
                  {t("authz.permissionCreate.codeHint")}
                </p>
              </label>

              {/* Status */}
              <div className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  Status
                </span>
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
                      <span className={`h-2 w-2 rounded-full ${s === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* is_system */}
              <div className="flex items-center gap-3 sm:col-span-2">
                <input
                  checked={isSystem}
                  className="h-4 w-4 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                  id="is_system"
                  onChange={(e) => setIsSystem(e.target.checked)}
                  type="checkbox"
                />
                <label className="text-sm text-[var(--dashboard-muted-strong)]" htmlFor="is_system">
                  System permission
                </label>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[var(--dashboard-border-soft)] px-6 py-4">
              <a
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-5 text-sm font-semibold text-[var(--dashboard-muted-strong)] transition hover:bg-[var(--dashboard-panel-subtle)]"
                href={routes.appPermissions(appId)}
              >
                {t("authz.form.cancel")}
              </a>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hero-border bg-hero px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || !name || !selectedModule || !selectedAction}
                onClick={() => void submit()}
                type="button"
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
          </div>
        </section>
      </div>
    </div>
  );
}
