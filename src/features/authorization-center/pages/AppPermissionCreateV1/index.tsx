"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import type { TranslationKey } from "@/modules/preferences";
import { SearchDropdown } from "@/shared/components/SearchDropdown";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import {
  useAppPermissionCreateController,
  type PermissionRow,
} from "./controller/useAppPermissionCreateController";

type AppPermissionCreateV1Props = {
  appId: string;
};

const riskLevels = ["low", "medium", "high", "critical"] as const;

export function AppPermissionCreateV1({ appId }: AppPermissionCreateV1Props) {
  const { t } = usePreferences();
  const {
    actions,
    addRow,
    app,
    buildCode,
    error,
    isLoadingInit,
    isSubmitting,
    modules,
    removeRow,
    rows,
    setActionSearch,
    setModuleSearch,
    submit,
    updateRow,
  } = useAppPermissionCreateController(appId);

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
        description={t("authz.permissionCreate.description")}
        title={app ? `${app.name} · ${t("authz.permissionCreate.title")}` : t("authz.permissionCreate.title")}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="permissions" appId={appId} />

        <section className="flex-1 space-y-4">
          {/* Permission rows */}
          {rows.map((row, idx) => (
            <PermissionRowCard
              actions={actions}
              app={app}
              buildCode={buildCode}
              idx={idx}
              key={row.id}
              modules={modules}
              onRemove={() => removeRow(row.id)}
              onUpdate={(patch) => updateRow(row.id, patch)}
              row={row}
              setActionSearch={setActionSearch}
              setModuleSearch={setModuleSearch}
              showRemove={rows.length > 1}
              t={t}
            />
          ))}

          {/* Add row */}
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--dashboard-border)] py-4 text-sm font-semibold text-[var(--dashboard-muted)] transition hover:border-[var(--dashboard-accent-border)] hover:text-[var(--dashboard-accent)]"
            onClick={addRow}
            type="button"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("authz.permissionCreate.addRow")}
          </button>

          {/* Error */}
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-5 text-sm font-semibold text-[var(--dashboard-muted-strong)] transition hover:bg-[var(--dashboard-panel-subtle)]"
              href={routes.appPermissions(appId)}
            >
              {t("authz.form.cancel")}
            </a>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hero-border bg-hero px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
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
        </section>
      </div>
    </div>
  );
}

// ─── Row card ────────────────────────────────────────────────────────────────

type RowCardProps = {
  actions: { id: number; name: string; code: string }[];
  app: { code: string } | null;
  buildCode: (row: PermissionRow) => string;
  idx: number;
  modules: { id: number; name: string; code: string }[];
  onRemove: () => void;
  onUpdate: (patch: Partial<PermissionRow>) => void;
  row: PermissionRow;
  setActionSearch: (q: string) => void;
  setModuleSearch: (q: string) => void;
  showRemove: boolean;
  t: (key: TranslationKey) => string;
};

function PermissionRowCard({
  actions,
  buildCode,
  idx,
  modules,
  onRemove,
  onUpdate,
  row,
  setActionSearch,
  setModuleSearch,
  showRemove,
  t,
}: RowCardProps) {
  const autoCode = buildCode(row);
  const displayCode = row.codeOverride ?? autoCode;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
      {/* Row header */}
      <div className="flex items-center justify-between border-b border-[var(--dashboard-border-soft)] px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
          #{idx + 1}
        </span>
        {showRemove && (
          <button
            className="text-xs font-semibold text-red-500 hover:text-red-700"
            onClick={onRemove}
            type="button"
          >
            {t("authz.permissionCreate.removeRow")}
          </button>
        )}
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {/* Module */}
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
            {t("authz.permissionCreate.moduleLabel")} <span className="text-red-500">*</span>
          </span>
          <SearchDropdown
            onSearch={setModuleSearch}
            onSelect={(opt) =>
              onUpdate({
                module: opt.id ? { id: opt.id, label: opt.label, sublabel: opt.sublabel ?? "" } : null,
                codeOverride: null,
              })
            }
            options={modules.map((m) => ({ id: m.id, label: m.name, sublabel: m.code }))}
            placeholder={t("authz.permissionCreate.moduleLabel")}
            value={row.module}
          />
        </label>

        {/* Action */}
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
            {t("authz.permissionCreate.actionLabel")} <span className="text-red-500">*</span>
          </span>
          <SearchDropdown
            onSearch={setActionSearch}
            onSelect={(opt) =>
              onUpdate({
                action: opt.id ? { id: opt.id, label: opt.label, sublabel: opt.sublabel ?? "" } : null,
                codeOverride: null,
              })
            }
            options={actions.map((a) => ({ id: a.id, label: a.name, sublabel: a.code }))}
            placeholder={t("authz.permissionCreate.actionLabel")}
            value={row.action}
          />
        </label>

        {/* Name */}
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
            {t("authz.permissionCreate.nameLabel")} <span className="text-red-500">*</span>
          </span>
          <input
            className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder={t("authz.permissionCreate.namePlaceholder")}
            type="text"
            value={row.name}
          />
        </label>

        {/* Risk level */}
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
            {t("authz.permissionCreate.riskLabel")}
          </span>
          <select
            className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
            onChange={(e) => onUpdate({ risk_level: e.target.value as PermissionRow["risk_level"] })}
            value={row.risk_level}
          >
            {riskLevels.map((r) => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
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
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder={t("authz.permissionCreate.descriptionPlaceholder")}
            type="text"
            value={row.description}
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
              onChange={(e) => onUpdate({ codeOverride: e.target.value || null })}
              placeholder={autoCode || "app.module.action"}
              type="text"
              value={displayCode}
            />
            {row.codeOverride === null && autoCode && (
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
                  row.status === s
                    ? s === "active"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 bg-slate-50 text-slate-600"
                    : "border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-muted)] hover:border-[var(--dashboard-border)]"
                }`}
                key={s}
                onClick={() => onUpdate({ status: s })}
                type="button"
              >
                <span className={`h-2 w-2 rounded-full ${s === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
