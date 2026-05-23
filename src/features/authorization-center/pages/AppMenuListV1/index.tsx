"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { useAppMenuListController } from "./controller/useAppMenuListController";

type AppMenuListV1Props = {
  appId: string;
};

export function AppMenuListV1({ appId }: AppMenuListV1Props) {
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
    menus,
    search,
    setSearch,
  } = useAppMenuListController(appId);

  const confirmDeleteMenu = menus.find((m) => m.id === confirmDeleteId);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.menus.description")}
        title={app?.name ?? ""}
      />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="menus" appId={appId} />

        <section className="flex-1 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              className="h-10 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)] sm:max-w-xs"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("authz.menus.filter.search")}
              type="search"
              value={search}
            />
            <Button href={routes.appMenuCreate(appId)} variant="primary">
              {t("authz.menus.create")}
            </Button>
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
          {!isLoading && !error && menus.length === 0 && (
            <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-6 py-12 text-center">
              <p className="text-sm text-[var(--dashboard-muted)]">
                {t("authz.menus.empty")}
              </p>
            </div>
          )}

          {/* Menu list */}
          {!isLoading && menus.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-[var(--dashboard-border-soft)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
                    <th className="px-5 py-3">{t("authz.menus.col.name")}</th>
                    <th className="px-5 py-3">{t("authz.menus.col.code")}</th>
                    <th className="px-5 py-3">{t("authz.menus.col.route")}</th>
                    <th className="px-5 py-3">{t("authz.menus.col.order")}</th>
                    <th className="px-5 py-3">{t("authz.menus.col.status")}</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu, idx) => (
                    <tr
                      className={`transition hover:bg-[var(--dashboard-panel-subtle)] ${idx !== menus.length - 1 ? "border-b border-[var(--dashboard-border-soft)]" : ""}`}
                      key={menu.id}
                    >
                      <td className="px-5 py-3.5 font-medium text-[var(--dashboard-text)]">
                        {menu.name}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[var(--dashboard-muted)]">
                        {menu.code}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-[var(--dashboard-muted)]">
                        {menu.route_path}
                      </td>
                      <td className="px-5 py-3.5 text-center text-[var(--dashboard-muted)]">
                        {menu.sort_order}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={menu.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <a
                            className="text-xs font-semibold text-[var(--dashboard-accent)] hover:underline"
                            href={routes.appMenuEdit(appId, String(menu.id))}
                          >
                            {t("authz.menus.edit")}
                          </a>
                          <button
                            className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={deletingId === menu.id}
                            onClick={() => confirmDelete(menu.id)}
                            type="button"
                          >
                            {deletingId === menu.id ? "..." : t("authz.menus.delete")}
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
        description={`${t("authz.menuDelete.description")}${confirmDeleteMenu ? ` "${confirmDeleteMenu.name}"` : ""}`}
        isLoading={deletingId !== null}
        onCancel={cancelDelete}
        onConfirm={executeDelete}
        open={confirmDeleteId !== null}
        title={t("authz.menuDelete.title")}
        variant="danger"
      />
    </div>
  );
}
