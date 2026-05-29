"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Can } from "@/modules/opensuite-sdk";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { useAppModuleListController } from "./controller/useAppModuleListController";

type AppModuleListV1Props = {
  appId: string;
};

export function AppModuleListV1({ appId }: AppModuleListV1Props) {
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
    modules,
    search,
    setSearch,
  } = useAppModuleListController(appId);

  const confirmDeleteModule = modules.find((m) => m.id === confirmDeleteId);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.modules.description")}
        title={app?.name ?? ""}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="modules" appId={appId} />

        <section className="flex-1 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              className="h-10 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)] sm:max-w-xs"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("authz.modules.filter.search")}
              type="search"
              value={search}
            />
            <Can permission="authorization-center.modules.write">
              <Button href={routes.appModuleCreate(appId)} variant="primary">
                {t("authz.modules.create")}
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
          {!isLoading && !error && modules.length === 0 && (
            <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-6 py-12 text-center">
              <p className="text-sm text-[var(--dashboard-muted)]">
                {t("authz.modules.empty")}
              </p>
            </div>
          )}

          {/* Module list */}
          {!isLoading && modules.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--dashboard-border-soft)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Code</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {modules.map((mod, idx) => (
                    <tr
                      className={`transition hover:bg-[var(--dashboard-panel-subtle)] ${idx !== modules.length - 1 ? "border-b border-[var(--dashboard-border-soft)]" : ""}`}
                      key={mod.id}
                    >
                      <td className="px-5 py-3.5 font-medium text-[var(--dashboard-text)]">
                        {mod.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[var(--dashboard-muted)]">
                        {mod.code}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={mod.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <Can permission="authorization-center.modules.update">
                            <Link
                              className="text-xs font-semibold text-[var(--dashboard-accent)] hover:underline"
                              href={routes.appModuleEdit(appId, String(mod.id))}
                            >
                              {t("authz.modules.edit")}
                            </Link>
                          </Can>
                          <Can permission="authorization-center.modules.delete">
                            <button
                              className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={deletingId === mod.id}
                              onClick={() => confirmDelete(mod.id)}
                              type="button"
                            >
                              {deletingId === mod.id ? "..." : t("authz.modules.delete")}
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

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        description={`${t("authz.moduleDelete.description")}${confirmDeleteModule ? ` "${confirmDeleteModule.name}"` : ""}`}
        isLoading={deletingId !== null}
        onCancel={cancelDelete}
        onConfirm={executeDelete}
        open={confirmDeleteId !== null}
        title={t("authz.moduleDelete.title")}
        variant="danger"
      />
    </div>
  );
}
