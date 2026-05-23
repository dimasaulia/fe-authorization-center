"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { useAppRoleListController } from "./controller/useAppRoleListController";

type AppRoleListV1Props = { appId: string };

export function AppRoleListV1({ appId }: AppRoleListV1Props) {
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
    roles,
    search,
    setSearch,
  } = useAppRoleListController(appId);

  const confirmDeleteRole = roles.find((r) => r.id === confirmDeleteId);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.roles.description")}
        title={app?.name ?? ""}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="roles" appId={appId} />

        <section className="flex-1 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              className="h-10 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)] sm:max-w-xs"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("authz.roles.filter.search")}
              type="search"
              value={search}
            />
            <Button href={routes.appRoleCreate(appId)} variant="primary">
              {t("authz.roles.create")}
            </Button>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div className="h-16 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]" key={i} />
              ))}
            </div>
          )}

          {!isLoading && !error && roles.length === 0 && (
            <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-6 py-12 text-center">
              <p className="text-sm text-[var(--dashboard-muted)]">{t("authz.roles.empty")}</p>
            </div>
          )}

          {!isLoading && roles.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--dashboard-border-soft)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
                    <th className="px-5 py-3">{t("authz.roles.col.name")}</th>
                    <th className="px-5 py-3">{t("authz.roles.col.code")}</th>
                    <th className="px-5 py-3">{t("authz.roles.col.scope")}</th>
                    <th className="px-5 py-3">{t("authz.roles.col.status")}</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role, idx) => (
                    <tr
                      className={`transition hover:bg-[var(--dashboard-panel-subtle)] ${idx !== roles.length - 1 ? "border-b border-[var(--dashboard-border-soft)]" : ""}`}
                      key={role.id}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[var(--dashboard-text)]">{role.name}</p>
                        {role.description && (
                          <p className="mt-0.5 text-xs text-[var(--dashboard-muted)]">{role.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[var(--dashboard-muted)]">{role.code}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-lg border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-2 py-0.5 text-xs font-semibold text-[var(--dashboard-muted-strong)]">
                          {role.scope}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={role.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <a className="text-xs font-semibold text-[var(--dashboard-accent)] hover:underline" href={routes.appRoleEdit(appId, String(role.id))}>
                            {t("authz.roles.edit")}
                          </a>
                          <button
                            className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={deletingId === role.id}
                            onClick={() => confirmDelete(role.id)}
                            type="button"
                          >
                            {deletingId === role.id ? "..." : t("authz.roles.delete")}
                          </button>
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
        description={`${t("authz.roleDelete.description")}${confirmDeleteRole ? ` "${confirmDeleteRole.name}"` : ""}`}
        isLoading={deletingId !== null}
        onCancel={cancelDelete}
        onConfirm={executeDelete}
        open={confirmDeleteId !== null}
        title={t("authz.roleDelete.title")}
        variant="danger"
      />
    </div>
  );
}
