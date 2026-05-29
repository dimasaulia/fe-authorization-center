"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Can } from "@/modules/opensuite-sdk";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { useAppPermissionListController } from "./controller/useAppPermissionListController";
type AppPermissionListV1Props = {
  appId: string;
};

const riskColors: Record<string, string> = {
  low: "text-emerald-700 bg-emerald-50 border-emerald-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  high: "text-orange-700 bg-orange-50 border-orange-200",
  critical: "text-red-700 bg-red-50 border-red-200",
};

export function AppPermissionListV1({ appId }: AppPermissionListV1Props) {
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
    permissions,
    search,
    setSearch,
  } = useAppPermissionListController(appId);

  const confirmDeletePermission = permissions.find((p) => p.id === confirmDeleteId);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.permissions.description")}
        title={app?.name ?? ""}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="permissions" appId={appId} />

        <section className="flex-1 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              className="h-10 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)] sm:max-w-xs"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("authz.permissions.filter.search")}
              type="search"
              value={search}
            />
            <Can permission="authorization-center.permission.write">
              <Button href={routes.appPermissionCreate(appId)} variant="primary">
                {t("authz.permissions.create")}
              </Button>
            </Can>
          </div>

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
                  className="h-16 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]"
                  key={i}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && permissions.length === 0 && (
            <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-6 py-12 text-center">
              <p className="text-sm text-[var(--dashboard-muted)]">
                {t("authz.permissions.empty")}
              </p>
            </div>
          )}

          {/* Permission list */}
          {!isLoading && permissions.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--dashboard-border-soft)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
                    <th className="px-5 py-3">{t("authz.permissions.col.name")}</th>
                    <th className="px-5 py-3">{t("authz.permissions.col.code")}</th>
                    <th className="px-5 py-3">{t("authz.permissions.col.risk")}</th>
                     <th className="px-5 py-3">{t("authz.permissions.col.status")}</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm, idx) => (
                    <tr
                      className={`transition hover:bg-[var(--dashboard-panel-subtle)] ${idx !== permissions.length - 1 ? "border-b border-[var(--dashboard-border-soft)]" : ""}`}
                      key={perm.id}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[var(--dashboard-text)]">{perm.name}</p>
                        {perm.description && (
                          <p className="mt-0.5 text-xs text-[var(--dashboard-muted)]">{perm.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[var(--dashboard-muted)]">
                        {perm.code}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold ${riskColors[perm.risk_level] ?? ""}`}>
                          {perm.risk_level}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={perm.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <Can permission="authorization-center.permission.update">
                            <a
                              className="text-xs font-semibold text-[var(--dashboard-accent)] hover:underline"
                              href={routes.appPermissionEdit(appId, String(perm.id))}
                            >
                              {t("authz.permissions.edit")}
                            </a>
                          </Can>
                          <Can permission="authorization-center.permission.delete">
                            <button
                              className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={deletingId === perm.id}
                              onClick={() => confirmDelete(perm.id)}
                              type="button"
                            >
                              {deletingId === perm.id ? "..." : t("authz.permissions.delete")}
                            </button>
                          </Can>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        description={`${t("authz.permissionDelete.description")}${confirmDeletePermission ? ` "${confirmDeletePermission.name}"` : ""}`}
        isLoading={deletingId !== null}
        onCancel={cancelDelete}
        onConfirm={executeDelete}
        open={confirmDeleteId !== null}
        title={t("authz.permissionDelete.title")}
        variant="danger"
      />
    </div>
  );
}
