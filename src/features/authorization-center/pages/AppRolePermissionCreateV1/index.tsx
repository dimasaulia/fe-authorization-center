"use client";

import { usePreferences } from "@/modules/preferences";
import { SearchDropdown } from "@/shared/components/SearchDropdown";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { useAppRolePermissionCreateController } from "./controller/useAppRolePermissionCreateController";

type AppRolePermissionCreateV1Props = {
  appId: string;
};

const riskColors: Record<string, string> = {
  low: "text-emerald-700 bg-emerald-50 border-emerald-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  high: "text-orange-700 bg-orange-50 border-orange-200",
  critical: "text-red-700 bg-red-50 border-red-200",
};

export function AppRolePermissionCreateV1({ appId }: AppRolePermissionCreateV1Props) {
  const { t } = usePreferences();
  const {
    app,
    availableModules,
    rows,
    isLoading,
    loadError,
    isSubmitting,
    submitError,
    addRow,
    removeRow,
    handleRoleSearch,
    handleRoleSelect,
    setRowPermissionSearch,
    togglePermission,
    toggleModulePermissions,
    isDuplicateRole,
    submit,
    cancel,
  } = useAppRolePermissionCreateController(appId);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.rolePermissionCreate.description")}
        title={app?.name ?? ""}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="role-permissions" appId={appId} />

        <section className="flex-1 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--dashboard-text)]">
              {t("authz.rolePermissionCreate.formTitle")}
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
              {availableModules.length === 0 && (
                <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-6 py-10 text-center">
                  <p className="text-sm text-[var(--dashboard-muted)]">
                    {t("authz.rolePermissionCreate.noPermissions")}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {rows.map((row, rowIndex) => {
                  const allPermIds = availableModules.flatMap((m) =>
                    m.permissions.map((p) => p.id),
                  );
                  const allSelected =
                    allPermIds.length > 0 &&
                    allPermIds.every((id) => row.permissionIds.includes(id));

                  const isDupe = isDuplicateRole(rowIndex);

                  // Roles selected in other rows — mark them disabled in options
                  const otherSelectedRoleIds = rows
                    .filter((_, i) => i !== rowIndex)
                    .map((r) => r.roleId)
                    .filter((id) => id > 0);

                  // Filter out roles already used in other rows from the dropdown options
                  const filteredRoleOptions = row.roleOptions.filter(
                    (opt) => !otherSelectedRoleIds.includes(opt.id),
                  );

                  // Local permission search filter
                  const permSearch = row.permissionSearch.toLowerCase().trim();
                  const filteredModules = availableModules
                    .map((mod) => ({
                      ...mod,
                      permissions: mod.permissions.filter(
                        (p) =>
                          permSearch === "" ||
                          p.name.toLowerCase().includes(permSearch) ||
                          p.code.toLowerCase().includes(permSearch),
                      ),
                    }))
                    .filter((mod) => mod.permissions.length > 0);

                  return (
                    <div
                      className={`rounded-2xl border bg-[var(--dashboard-panel)] p-5 space-y-5 ${isDupe ? "border-red-300" : "border-[var(--dashboard-border)]"}`}
                      key={rowIndex}
                    >
                      {/* Role selector */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1.5">
                          <label className="block text-xs font-semibold text-[var(--dashboard-muted)]">
                            {t("authz.rolePermissionCreate.roleLabel")} *
                          </label>

                          <SearchDropdown
                            onSearch={(q) => handleRoleSearch(rowIndex, q)}
                            onSelect={(opt) => handleRoleSelect(rowIndex, opt)}
                            options={filteredRoleOptions}
                            placeholder={t("authz.rolePermissionCreate.searchRole")}
                            value={row.roleValue}
                          />

                          {isDupe && (
                            <p className="text-xs font-semibold text-red-600">
                              {t("authz.rolePermissionCreate.duplicateRole")}
                            </p>
                          )}
                        </div>

                        {rows.length > 1 && (
                          <button
                            className="mt-6 shrink-0 text-xs font-semibold text-red-600 hover:underline"
                            onClick={() => removeRow(rowIndex)}
                            type="button"
                          >
                            {t("authz.rolePermissionCreate.removeRole")}
                          </button>
                        )}
                      </div>

                      {/* Permissions section */}
                      <div className="space-y-3">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-xs font-semibold text-[var(--dashboard-muted)]">
                            {t("authz.rolePermissionCreate.permissionsLabel")}
                            {row.permissionIds.length > 0 && (
                              <span className="ml-1.5 inline-flex items-center rounded-full bg-[var(--dashboard-accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--dashboard-accent)]">
                                {row.permissionIds.length}
                              </span>
                            )}
                          </span>

                          <div className="flex items-center gap-3">
                            {/* Permission local search */}
                            <input
                              className="h-8 w-48 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3 text-xs text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                              onChange={(e) =>
                                setRowPermissionSearch(rowIndex, e.target.value)
                              }
                              placeholder={t("authz.rolePermissionCreate.searchPermission")}
                              type="search"
                              value={row.permissionSearch}
                            />

                            {/* Select/deselect all — only when no search active */}
                            {availableModules.length > 0 && permSearch === "" && (
                              <button
                                className="text-xs font-semibold text-[var(--dashboard-accent)] hover:underline"
                                onClick={() =>
                                  toggleModulePermissions(rowIndex, allPermIds)
                                }
                                type="button"
                              >
                                {allSelected
                                  ? t("authz.rolePermissionCreate.deselectAll")
                                  : t("authz.rolePermissionCreate.selectAll")}
                              </button>
                            )}
                          </div>
                        </div>

                        {filteredModules.length === 0 && permSearch !== "" && (
                          <p className="text-xs text-[var(--dashboard-muted)]">
                            {t("common.noResults")}
                          </p>
                        )}

                        {filteredModules.map((mod) => {
                          const modPermIds = mod.permissions.map((p) => p.id);
                          const modAllSelected = modPermIds.every((id) =>
                            row.permissionIds.includes(id),
                          );

                          return (
                            <div className="space-y-2" key={mod.modul_id}>
                              <div className="flex items-center gap-2">
                                <input
                                  checked={modAllSelected}
                                  className="h-4 w-4 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                                  id={`mod-${rowIndex}-${mod.modul_id}`}
                                  onChange={() =>
                                    toggleModulePermissions(rowIndex, modPermIds)
                                  }
                                  type="checkbox"
                                />
                                <label
                                  className="cursor-pointer text-xs font-semibold text-[var(--dashboard-text)]"
                                  htmlFor={`mod-${rowIndex}-${mod.modul_id}`}
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
                                      checked={row.permissionIds.includes(perm.id)}
                                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                                      onChange={() =>
                                        togglePermission(rowIndex, perm.id)
                                      }
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
                  );
                })}
              </div>

              {/* Add another role row */}
              <button
                className="text-sm font-semibold text-[var(--dashboard-accent)] hover:underline"
                onClick={addRow}
                type="button"
              >
                + {t("authz.rolePermissionCreate.addRole")}
              </button>

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
