"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";
import { SearchDropdown } from "@/shared/components/SearchDropdown";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { useAppMenuEditController } from "./controller/useAppMenuEditController";

type AppMenuEditV1Props = {
  appId: string;
  menuId: string;
};

export function AppMenuEditV1({ appId, menuId }: AppMenuEditV1Props) {
  const { t } = usePreferences();
  const {
    app,
    autoCode,
    code,
    codeOverride,
    displayCode,
    error,
    filteredModules,
    filteredPermissions,
    isLoadingInit,
    isSubmitting,
    moduleSearch,
    name,
    routePath,
    searchPermissions,
    selectedModule,
    selectedPermission,
    setCode,
    setCodeOverride,
    setModuleSearch,
    setName,
    setRoutePath,
    setSelectedModule,
    setSelectedPermission,
    setSortOrder,
    setStatus,
    sortOrder,
    status,
    submit,
  } = useAppMenuEditController(appId, menuId);

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
        description={t("authz.menuEdit.description")}
        title={app ? `${app.name} · ${t("authz.menuEdit.title")}` : t("authz.menuEdit.title")}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="menus" appId={appId} />

        <section className="flex-1">
          <div className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[var(--dashboard-border-soft)] px-6 py-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-subtle)]">
                <AppIcon className="h-5 w-5" name="shield" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-[var(--dashboard-text)]">
                  {t("authz.menuEdit.formTitle")}
                </h2>
                <p className="text-xs text-[var(--dashboard-muted)]">
                  {t("authz.form.required")}
                </p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {/* Name */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.menuCreate.nameLabel")} <span className="text-red-500">*</span>
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("authz.menuCreate.namePlaceholder")}
                  type="text"
                  value={name}
                />
              </label>

              {/* Module */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.menuCreate.moduleLabel")} <span className="text-red-500">*</span>
                </span>
                <SearchDropdown
                  onSearch={setModuleSearch}
                  onSelect={(opt) => {
                    setSelectedModule(opt.id ? { id: opt.id, label: opt.label, sublabel: opt.sublabel ?? "" } : null);
                    setCodeOverride(false);
                  }}
                  options={filteredModules.map((m) => ({ id: m.id, label: m.name, sublabel: m.code }))}
                  placeholder={t("authz.menuCreate.moduleLabel")}
                  value={selectedModule}
                />
              </label>

              {/* Route path */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.menuCreate.routeLabel")} <span className="text-red-500">*</span>
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 font-mono text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  onChange={(e) => setRoutePath(e.target.value)}
                  placeholder={t("authz.menuCreate.routePlaceholder")}
                  type="text"
                  value={routePath}
                />
              </label>

              {/* Sort order */}
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.menuCreate.sortLabel")}
                </span>
                <input
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  min={1}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  type="number"
                  value={sortOrder}
                />
              </label>

              {/* Required permission */}
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.menuCreate.permissionLabel")}
                </span>
                <SearchDropdown
                  onSearch={searchPermissions}
                  onSelect={(opt) =>
                    setSelectedPermission(opt.id ? { id: opt.id, label: opt.label, sublabel: opt.sublabel ?? "" } : null)
                  }
                  options={filteredPermissions.map((p) => ({ id: p.id, label: p.name, sublabel: p.code }))}
                  placeholder={t("authz.menuCreate.permissionLabel")}
                  value={selectedPermission}
                />
              </label>

              {/* Code */}
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                  {t("authz.menuCreate.codeLabel")}
                </span>
                <div className="relative">
                  <input
                    className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 pr-16 font-mono text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                    onChange={(e) => {
                      setCode(e.target.value);
                      setCodeOverride(true);
                    }}
                    placeholder={autoCode || "app.module.menu"}
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
                  {t("authz.menuCreate.codeHint")}
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
                href={routes.appMenus(appId)}
              >
                {t("authz.form.cancel")}
              </a>
              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hero-border bg-hero px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || !name || !selectedModule || !routePath}
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
