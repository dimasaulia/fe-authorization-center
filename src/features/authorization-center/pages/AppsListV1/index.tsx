"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

import { AppCard } from "../../components/AppCard";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { AuthCenterNav } from "../../components/AuthCenterNav";
import { StatusBadge } from "../../components/StatusBadge";
import { useAppsListController } from "./controller/useAppsListController";

export function AppsListV1() {
  const { t } = usePreferences();
  const { apps, error, isLoading, search, setSearch, reload } =
    useAppsListController();

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        actionHref={routes.appCreate}
        actionLabel={t("authz.apps.create")}
        description={t("authz.apps.description")}
        title={t("authz.apps.title")}
      />
      <AuthCenterNav active="apps" />

      {/* Search bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-4 py-3">
        <AppIcon
          className="h-4 w-4 shrink-0 text-[var(--dashboard-subtle)]"
          name="search"
        />
        <input
          className="flex-1 bg-transparent text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)]"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("authz.filter.search.apps")}
          type="search"
          value={search}
        />
        {search.length > 0 && (
          <button
            className="text-xs text-[var(--dashboard-muted)] hover:text-[var(--dashboard-text)]"
            onClick={() => setSearch("")}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{error}</span>
          <button
            className="font-semibold underline"
            onClick={reload}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AppCard variant="create" />
          {[1, 2, 3].map((i) => (
            <div
              className="min-h-[210px] animate-pulse rounded-[18px] border border-[var(--dashboard-border)] bg-[var(--dashboard-panel-subtle)]"
              key={i}
            />
          ))}
        </section>
      )}

      {/* App cards */}
      {!isLoading && !error && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AppCard variant="create" />
          {apps.length === 0 ? (
            <div className="col-span-3 flex min-h-[210px] flex-col items-center justify-center gap-3 rounded-[18px] border border-dashed border-[var(--dashboard-border)] text-[var(--dashboard-muted)]">
              <AppIcon className="h-8 w-8 opacity-40" name="shield" />
              <p className="text-sm">
                {search
                  ? `No apps found for "${search}"`
                  : "No apps yet. Create your first app."}
              </p>
            </div>
          ) : (
            apps.map((app) => (
              <Link
                className="flex min-h-[210px] flex-col overflow-hidden rounded-[18px] border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_2px_var(--dashboard-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--dashboard-accent-border)] hover:shadow-[0_12px_28px_var(--dashboard-shadow)]"
                href={routes.appDetail(app.code)}
                key={app.id}
              >
                <div className="flex h-[104px] shrink-0 items-center justify-center border-b border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel-subtle)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] text-[var(--dashboard-subtle)]">
                    <AppIcon className="h-6 w-6" name="shield" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-base font-semibold leading-[1.2] text-[var(--dashboard-text)]">
                      {app.name}
                    </strong>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-[13px] leading-[1.35] text-[var(--dashboard-muted)]">
                    {app.code}
                  </p>
                </div>
              </Link>
            ))
          )}
        </section>
      )}

      <p className="text-sm text-[var(--dashboard-muted)]">
        {isLoading ? "Loading..." : `${apps.length} app${apps.length !== 1 ? "s" : ""} found`}
      </p>
    </div>
  );
}
