"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import type { RoleSummary } from "../../../modules/role-permissions/role-permissions.type";
import type { TranslationKey } from "@/modules/preferences/dictionaries";

type RoleSummaryCardsProps = {
  appId: string;
  roleSummaries: RoleSummary[];
  t: (key: TranslationKey) => string;
};

export function RoleSummaryCards({ appId, roleSummaries, t }: RoleSummaryCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--dashboard-text)]">
          {t("authz.rolePermissions.roleSummaries.title")}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Add card — links to dedicated create page */}
        <Link
          className="flex h-24 w-48 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] text-[var(--dashboard-muted)] transition hover:border-[var(--dashboard-accent-border)] hover:text-[var(--dashboard-accent)]"
          href={routes.appRolePermissionCreate(appId)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-current text-lg font-bold leading-none">
            +
          </span>
          <span className="text-xs font-semibold">{t("authz.rolePermissions.add")}</span>
        </Link>

        {/* Empty state */}
        {roleSummaries.length === 0 && (
          <div className="flex h-24 w-48 items-center justify-center rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
            <p className="text-xs text-[var(--dashboard-muted)]">
              {t("authz.rolePermissions.roleSummaries.empty")}
            </p>
          </div>
        )}

        {/* Role summary cards */}
        {roleSummaries.map((summary) => (
          <Link
            className="flex h-24 w-48 flex-col justify-between rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-4 transition hover:border-[var(--dashboard-accent-border)] hover:shadow-sm"
            href={routes.appRolePermissionEdit(appId, summary.role_code)}
            key={summary.role_id}
          >
            <div>
              <p className="truncate text-sm font-semibold text-[var(--dashboard-text)]">
                {summary.role_name}
              </p>
              <p className="mt-0.5 truncate font-mono text-xs text-[var(--dashboard-muted)]">
                {summary.role_code}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-lg border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-2 py-0.5 text-xs font-semibold text-[var(--dashboard-muted-strong)]">
                {summary.role_scope}
              </span>
              <span className="text-xs font-bold text-[var(--dashboard-accent)]">
                {summary.permission_count} {t("authz.rolePermissions.col.permissionCount")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
