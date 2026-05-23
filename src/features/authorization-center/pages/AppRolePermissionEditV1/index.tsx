"use client";

import { usePreferences } from "@/modules/preferences";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { useAppRolePermissionEditController } from "./controller/useAppRolePermissionEditController";

type AppRolePermissionEditV1Props = {
  appId: string;
  roleId: string;
};

const riskColors: Record<string, string> = {
  low: "text-emerald-700 bg-emerald-50 border-emerald-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  high: "text-orange-700 bg-orange-50 border-orange-200",
  critical: "text-red-700 bg-red-50 border-red-200",
};

export function AppRolePermissionEditV1({ appId, roleId }: AppRolePermissionEditV1Props) {
  const { t } = usePreferences();
  const {
    app,
    roleInfo,
    filteredModules,
    selectedPermissionIds,
    permissionSearch,
    setPermissionSearch,
    allSelected,
    allPermIds,
    isLoading,
    loadError,
    isSubmitting,
    submitError,
    togglePermission,
    toggleModulePermissions,
    toggleAll,
    submit,
    cancel,
  } = useAppRolePermissionEditController(appId, roleId);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.rolePermissionEdit.description")}
        title={app?.name ?? ""}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="role-permissions" appId={appId} />

        <section className="flex-1 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--dashboard-text)]">
              {t("authz.rolePermissionEdit.formTitle")}
            </h2>
          </div>

          {loadError && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </p>
          )}

          {submitError && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </p>
          )}

          {isLoading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  className="h-40 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]"
                  key={i}
                />
              ))}
            </div>
          )}

          {!isLoading && (
            <>
              {/* Single card wrapping role identity + permissions — matches create page layout */}
              <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5 space-y-5">

                {/* Role identity header */}
                {roleInfo && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[var(--dashboard-muted)]">
                      {t("authz.rolePermissionCreate.roleLabel")}
                    </label>
                    <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5">
                      <span className="text-sm font-semibold text-[var(--dashboard-text)]">
                        {roleInfo.name}
                      </span>
                      <span className="font-mono text-xs text-[var(--dashboard-muted)]">
                        {roleInfo.code}
                      </span>
                      {roleInfo.scope && (
                        <span className="ml-auto inline-flex items-center rounded-lg border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] px-2 py-0.5 text-xs font-semibold text-[var(--dashboard-muted-strong)]">
                          {roleInfo.scope}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Permissions section */}
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-semibold text-[var(--dashboard-muted)]">
                      {t("authz.rolePermissionCreate.permissionsLabel")}
                      {selectedPermissionIds.length > 0 && (
                        <span className="ml-1.5 inline-flex items-center rounded-full bg-[var(--dashboard-accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--dashboard-accent)]">
                          {selectedPermissionIds.length}
                        </span>
                      )}
                    </span>

                    <div className="flex items-center gap-3">
                      <input
                        className="h-8 w-48 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3 text-xs text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                        onChange={(e) => setPermissionSearch(e.target.value)}
                        placeholder={t("authz.rolePermissionCreate.searchPermission")}
                        type="search"
                        value={permissionSearch}
                      />

                      {allPermIds.length > 0 && permissionSearch.trim() === "" && (
                        <button
                          className="text-xs font-semibold text-[var(--dashboard-accent)] hover:underline"
                          onClick={toggleAll}
                          type="button"
                        >
                          {allSelected
                            ? t("authz.rolePermissionCreate.deselectAll")
                            : t("authz.rolePermissionCreate.selectAll")}
                        </button>
                      )}
                    </div>
                  </div>

                  {filteredModules.length === 0 && permissionSearch.trim() !== "" && (
                    <p className="text-xs text-[var(--dashboard-muted)]">
                      {t("common.noResults")}
                    </p>
                  )}

                  {filteredModules.length === 0 && permissionSearch.trim() === "" && (
                    <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-6 py-10 text-center">
                      <p className="text-sm text-[var(--dashboard-muted)]">
                        {t("authz.rolePermissionCreate.noPermissions")}
                      </p>
                    </div>
                  )}

                  {filteredModules.map((mod) => {
                    const modPermIds = mod.permissions.map((p) => p.id);
                    const modAllSelected = modPermIds.every((id) =>
                      selectedPermissionIds.includes(id),
                    );

                    return (
                      <div className="space-y-2" key={mod.modul_id}>
                        <div className="flex items-center gap-2">
                          <input
                            checked={modAllSelected}
                            className="h-4 w-4 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                            id={`mod-edit-${mod.modul_id}`}
                            onChange={() => toggleModulePermissions(modPermIds)}
                            type="checkbox"
                          />
                          <label
                            className="cursor-pointer text-xs font-semibold text-[var(--dashboard-text)]"
                            htmlFor={`mod-edit-${mod.modul_id}`}
                          >
                            {mod.modul_name}
                            <span className="ml-1.5 font-mono font-normal text-[var(--dashboard-muted)]">
                              {mod.modul_code}
                            </span>
                          </label>
                        </div>

                        <div className="ml-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {mod.permissions.map((perm) => (
                            <label
                              className="flex cursor-pointer items-start gap-2 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel-subtle)] px-3 py-2.5 transition hover:bg-[var(--dashboard-panel)]"
                              key={perm.id}
                            >
                              <input
                                checked={selectedPermissionIds.includes(perm.id)}
                                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                                onChange={() => togglePermission(perm.id)}
                                type="checkbox"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[var(--dashboard-text)]">
                                  {perm.name}
                                </p>
                                <p className="truncate font-mono text-[10px] text-[var(--dashboard-muted)]">
                                  {perm.code}
                                </p>
                                <span
                                  className={`mt-1 inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold ${riskColors[perm.risk_level] ?? ""}`}
                                >
                                  {perm.risk_level}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form footer */}
              <div className="flex items-center justify-end gap-3 border-t border-[var(--dashboard-border-soft)] pt-5">
                <button
                  className="rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-4 py-2 text-sm font-semibold text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                  onClick={cancel}
                  type="button"
                >
                  {t("authz.form.cancel")}
                </button>
                <button
                  className="rounded-xl bg-[var(--dashboard-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                  onClick={submit}
                  type="button"
                >
                  {isSubmitting ? "..." : t("authz.form.save")}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
