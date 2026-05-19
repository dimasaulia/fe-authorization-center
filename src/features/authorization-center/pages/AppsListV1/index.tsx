import Link from "next/link";

import { routes } from "@/config/routes.config";

import { AppCard } from "../../components/AppCard";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { AuthCenterNav } from "../../components/AuthCenterNav";
import { FilterBar } from "../../components/FilterBar";
import { StatusBadge } from "../../components/StatusBadge";
import { appTypes, authorizationApps } from "../../data/authorization-center.data";

export function AppsListV1() {
  return (
    <div className="space-y-6">
      <AuthCenterHeader
        actionHref={routes.appCreate}
        actionLabel="Create App"
        description="Manage applications that consume OpenSuite Authorization Center, starting from identity, credentials, and foundational access data."
        title="Apps"
      />
      <AuthCenterNav active="apps" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AppCard variant="create" />
        {authorizationApps.map((app) => (
          <AppCard app={app} key={app.id} />
        ))}
      </section>

      <FilterBar
        searchPlaceholder="Search by app name or code"
        secondaryFilterLabel="Type"
        secondaryFilterOptions={appTypes}
      />

      <section className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[1.2fr_1fr_120px_110px_140px_130px_130px_180px] border-b border-[var(--dashboard-border-soft)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.04em] text-[var(--dashboard-muted)]">
            <span>App Name</span>
            <span>App Code</span>
            <span>Type</span>
            <span>Status</span>
            <span>Environment Count</span>
            <span>Created At</span>
            <span>Last Updated</span>
            <span>Actions</span>
          </div>
          {authorizationApps.map((app) => (
            <div
              className="grid grid-cols-[1.2fr_1fr_120px_110px_140px_130px_130px_180px] items-center border-b border-[var(--dashboard-border-soft)] px-4 py-4 text-sm last:border-b-0"
              key={app.id}
            >
              <strong className="text-[var(--dashboard-text)]">{app.name}</strong>
              <span className="text-[var(--dashboard-muted)]">{app.code}</span>
              <span>{app.type}</span>
              <StatusBadge status={app.status} />
              <span>{app.environmentCount}</span>
              <span>{app.createdAt}</span>
              <span>{app.updatedAt}</span>
              <span className="flex gap-3 text-xs font-semibold text-[var(--dashboard-accent)]">
                <Link href={routes.appDetail(app.id)}>View Detail</Link>
                <Link href={routes.appSettings(app.id)}>Edit</Link>
                <button className="text-[var(--dashboard-muted)]" type="button">
                  {app.status === "active" ? "Disable" : "Enable"}
                </button>
              </span>
            </div>
          ))}
        </div>
      </section>
      <p className="text-sm text-[var(--dashboard-muted)]">Page 1 of 1</p>
    </div>
  );
}
