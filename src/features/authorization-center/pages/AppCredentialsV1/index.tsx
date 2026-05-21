"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { FilterBar } from "../../components/FilterBar";
import { StatusBadge } from "../../components/StatusBadge";
import {
  environments,
  getAppCredentials,
  getAuthorizationApp,
} from "../../data/authorization-center.data";

type AppCredentialsV1Props = {
  appId: string;
};

export function AppCredentialsV1({ appId }: AppCredentialsV1Props) {
  const { t } = usePreferences();
  const app = getAuthorizationApp(appId);
  const credentials = getAppCredentials(app.id);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.credentials.description")}
        title={t("authz.appDetail.tabs.credentials")}
      />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="credentials" appId={app.id} />
        <section className="min-w-0 flex-1 space-y-5">
          <div className="flex justify-end">
            <Button href={routes.appCredentialCreate(app.id)}>
              {t("authz.credentials.create")}
            </Button>
          </div>
          <FilterBar
            searchPlaceholder={t("authz.filter.search.credentials")}
            secondaryFilterLabel="Environment"
            secondaryFilterOptions={environments}
          />
          <section className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[1.2fr_1.2fr_120px_1.5fr_110px_140px_120px_190px] border-b border-[var(--dashboard-border-soft)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.04em] text-[var(--dashboard-muted)]">
                <span>Name</span>
                <span>Client ID / App ID</span>
                <span>Environment</span>
                <span>Scopes</span>
                <span>Status</span>
                <span>Last Used At</span>
                <span>Created At</span>
                <span>Actions</span>
              </div>
              {credentials.map((credential) => (
                <div
                  className="grid grid-cols-[1.2fr_1.2fr_120px_1.5fr_110px_140px_120px_190px] items-center border-b border-[var(--dashboard-border-soft)] px-4 py-4 text-sm last:border-b-0"
                  key={credential.id}
                >
                  <strong>{credential.name}</strong>
                  <span className="text-[var(--dashboard-muted)]">{credential.clientId}</span>
                  <span>{credential.environment}</span>
                  <span className="truncate text-[var(--dashboard-muted)]">
                    {credential.scopes.join(", ")}
                  </span>
                  <StatusBadge status={credential.status} />
                  <span>{credential.lastUsedAt}</span>
                  <span>{credential.createdAt}</span>
                  <span className="flex gap-2 text-xs font-semibold text-[var(--dashboard-accent)]">
                    <Link href={routes.appCredentials(app.id)}>View</Link>
                    <button type="button">Rotate</button>
                    <button className="text-red-600" type="button">Revoke</button>
                  </span>
                </div>
              ))}
            </div>
          </section>
          <p className="text-sm text-[var(--dashboard-muted)]">{t("authz.pagination")}</p>
        </section>
      </div>
    </div>
  );
}
