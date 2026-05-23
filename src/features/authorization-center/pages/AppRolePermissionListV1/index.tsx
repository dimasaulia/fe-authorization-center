"use client";

import { usePreferences } from "@/modules/preferences";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { useAppRolePermissionListController } from "./controller/useAppRolePermissionListController";
import { RoleSummaryCards } from "./components/RoleSummaryCards";

type AppRolePermissionListV1Props = {
  appId: string;
};

export function AppRolePermissionListV1({ appId }: AppRolePermissionListV1Props) {
  const { t } = usePreferences();
  const {
    app,
    cancelDelete,
    confirmDelete,
    confirmDeleteId,
    deletingId,
    error,
    executeDelete,
    isLoading,
    rolePermissions,
    roles,
    roleSummaries,
  } = useAppRolePermissionListController(appId);

  const confirmDeleteItem = rolePermissions.find((rp) => rp.id === confirmDeleteId);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.rolePermissions.description")}
        title={app?.name ?? ""}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="role-permissions" appId={appId} />

        <section className="flex-1 space-y-6">
          {/* Error */}
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  className="h-20 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]"
                  key={i}
                />
              ))}
            </div>
          )}

          {!isLoading && (
            <>
              {/* Role Summary Cards */}
              <RoleSummaryCards
                appId={appId}
                roleSummaries={roleSummaries}
                t={t}
              />

              {/* Role Permission Table */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-[var(--dashboard-text)]">
                  {t("authz.rolePermissions.title")}
                </h2>

                {rolePermissions.length === 0 && (
                  <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-6 py-12 text-center">
                    <p className="text-sm text-[var(--dashboard-muted)]">
                      {t("authz.rolePermissions.empty")}
                    </p>
                  </div>
                )}

                {rolePermissions.length > 0 && (
                  <div className="overflow-x-auto rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
                    <table className="w-full min-w-[700px] text-sm">
                      <thead>
                        <tr className="border-b border-[var(--dashboard-border-soft)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
                          <th className="px-5 py-3">{t("authz.rolePermissions.col.role")}</th>
                          <th className="px-5 py-3">{t("authz.rolePermissions.col.permission")}</th>
                          <th className="px-5 py-3">{t("authz.rolePermissions.col.module")}</th>
                          <th className="px-5 py-3">{t("authz.rolePermissions.col.effect")}</th>
                          <th className="px-5 py-3" />
                        </tr>
                      </thead>
                      <tbody>
                        {rolePermissions.map((rp, idx) => (
                          <tr
                            className={`transition hover:bg-[var(--dashboard-panel-subtle)] ${idx !== rolePermissions.length - 1 ? "border-b border-[var(--dashboard-border-soft)]" : ""}`}
                            key={rp.id}
                          >
                            <td className="px-5 py-3.5">
                              <span className="inline-flex items-center rounded-lg border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-2 py-0.5 text-xs font-semibold text-[var(--dashboard-muted-strong)]">
                                {roles.find((r) => r.id === rp.role_id)?.name ?? `Role #${rp.role_id}`}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="font-medium text-[var(--dashboard-text)]">{rp.permission_name}</p>
                              <p className="mt-0.5 font-mono text-xs text-[var(--dashboard-muted)]">{rp.permission_code}</p>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-[var(--dashboard-muted)]">
                              {rp.module_name}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold ${rp.effect === "allow" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                                {rp.effect}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end">
                                <button
                                  className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                  disabled={deletingId === rp.id}
                                  onClick={() => confirmDelete(rp.id)}
                                  type="button"
                                >
                                  {deletingId === rp.id ? "..." : t("authz.rolePermissions.delete")}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        description={`${t("authz.rolePermissionDelete.description")}${confirmDeleteItem ? ` "${confirmDeleteItem.permission_name}"` : ""}`}
        isLoading={deletingId !== null}
        onCancel={cancelDelete}
        onConfirm={executeDelete}
        open={confirmDeleteId !== null}
        title={t("authz.rolePermissionDelete.title")}
        variant="danger"
      />
    </div>
  );
}
