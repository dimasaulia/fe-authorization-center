"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";

import { AuthCenterHeader } from "../../../authorization-center/components/AuthCenterHeader";
import { AuthCenterNav } from "../../../authorization-center/components/AuthCenterNav";
import { useUserListController } from "./controller/useUserListController";

const statusColors: Record<string, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  invited: "border-amber-200 bg-amber-50 text-amber-700",
  inactive: "border-slate-200 bg-slate-50 text-slate-600",
};

export function UserListV1() {
  const { t } = usePreferences();
  const { users, search, setSearch, isLoading, error } = useUserListController();

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        actionHref={routes.userCreate}
        actionLabel={t("users.create")}
        description={t("users.description")}
        title={t("users.title")}
      />

      <AuthCenterNav active="users" />

      <section className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="h-10 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)] sm:max-w-xs"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("users.filter.search")}
            type="search"
            value={search}
          />
          <Button href={routes.userCreate} variant="primary">
            {t("users.create")}
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
            {[1, 2, 3, 4].map((i) => (
              <div
                className="h-16 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]"
                key={i}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && users.length === 0 && (
          <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-6 py-12 text-center">
            <p className="text-sm text-[var(--dashboard-muted)]">{t("users.empty")}</p>
          </div>
        )}

        {/* User table */}
        {!isLoading && users.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-[var(--dashboard-border-soft)] text-left text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
                  <th className="px-5 py-3">{t("users.col.name")}</th>
                  <th className="px-5 py-3">{t("users.col.username")}</th>
                  <th className="px-5 py-3">{t("users.col.email")}</th>
                  <th className="px-5 py-3">{t("users.col.type")}</th>
                  <th className="px-5 py-3">{t("users.col.status")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr
                    className={`transition hover:bg-[var(--dashboard-panel-subtle)] ${idx !== users.length - 1 ? "border-b border-[var(--dashboard-border-soft)]" : ""}`}
                    key={user.id}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[var(--dashboard-text)]">
                        {user.display_name}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-[var(--dashboard-muted)]">
                      {user.username}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[var(--dashboard-muted)]">
                      {user.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center rounded-lg border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-2 py-0.5 text-xs font-semibold text-[var(--dashboard-muted-strong)]">
                        {user.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold ${statusColors[user.status] ?? ""}`}>
                        {t(`users.status.${user.status}` as "users.status.active")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
