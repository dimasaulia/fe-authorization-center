"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { AuthCenterNav } from "../../components/AuthCenterNav";
import { FilterBar } from "../../components/FilterBar";
import { StatusBadge } from "../../components/StatusBadge";
import { authorizationActions } from "../../data/authorization-center.data";

export function ActionsListV1() {
  const { t } = usePreferences();

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        actionHref={routes.actionCreate}
        actionLabel={t("authz.actions.create")}
        description={t("authz.actions.description")}
        title={t("authz.actions.title")}
      />
      <AuthCenterNav active="actions" />
      <FilterBar
        searchPlaceholder={t("authz.filter.search.actions")}
        secondaryFilterLabel="Type"
        secondaryFilterOptions={["read", "write", "approval", "export", "admin", "system"]}
      />
      <section className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[1fr_1fr_110px_110px_110px_100px_120px_170px] border-b border-[var(--dashboard-border-soft)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.04em] text-[var(--dashboard-muted)]">
            <span>Action Name</span>
            <span>Action Code</span>
            <span>Type</span>
            <span>Risk Level</span>
            <span>Status</span>
            <span>System</span>
            <span>Created At</span>
            <span>Actions</span>
          </div>
          {authorizationActions.map((action) => (
            <div
              className="grid grid-cols-[1fr_1fr_110px_110px_110px_100px_120px_170px] items-center border-b border-[var(--dashboard-border-soft)] px-4 py-4 text-sm last:border-b-0"
              key={action.id}
            >
              <strong>{action.name}</strong>
              <span className="text-[var(--dashboard-muted)]">{action.code}</span>
              <span>{action.type}</span>
              <span className="capitalize">{action.riskLevel}</span>
              <StatusBadge status={action.status} />
              <span>{action.isSystem ? "Yes" : "No"}</span>
              <span>{action.createdAt}</span>
              <span className="flex gap-3 text-xs font-semibold text-[var(--dashboard-accent)]">
                <Link href={routes.actions}>View</Link>
                <Link href={routes.actionCreate}>Edit</Link>
                <button className="text-[var(--dashboard-muted)]" type="button">Disable</button>
              </span>
            </div>
          ))}
        </div>
      </section>
      <p className="text-sm text-[var(--dashboard-muted)]">{t("authz.pagination")}</p>
    </div>
  );
}
