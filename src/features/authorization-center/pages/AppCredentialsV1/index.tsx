"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { FilterBar } from "../../components/FilterBar";
import { environments } from "../../data/authorization-center.data";
import { useAppCredentialsController } from "./controller/useAppCredentialsController";

type AppCredentialsV1Props = {
  appId: string;
};

export function AppCredentialsV1({ appId }: AppCredentialsV1Props) {
  const { t } = usePreferences();
  const { app, isLoading, error } = useAppCredentialsController(appId);

  if (isLoading) {
    return (
      <div className="h-32 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]" />
    );
  }

  if (error || !app) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        {error ?? t("common.error.notFound")}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.credentials.description")}
        title={t("authz.appDetail.tabs.credentials")}
      />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="credentials" appId={appId} />
        <section className="min-w-0 flex-1 space-y-5">
          <div className="flex justify-end">
            <Button href={routes.appCredentialCreate(appId)}>
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
              <div className="px-4 py-8 text-center text-sm text-[var(--dashboard-muted)]">
                {t("authz.modules.empty")}
              </div>
            </div>
          </section>
          <p className="text-sm text-[var(--dashboard-muted)]">{t("authz.pagination")}</p>
        </section>
      </div>
    </div>
  );
}
