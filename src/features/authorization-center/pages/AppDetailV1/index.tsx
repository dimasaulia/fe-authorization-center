"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { useAppDetailController } from "./controller/useAppDetailController";

type AppDetailV1Props = {
  appId: string;
};

export function AppDetailV1({ appId }: AppDetailV1Props) {
  const { t } = usePreferences();
  const { app, isLoading, error } = useAppDetailController(appId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]" />
        <div className="h-24 animate-pulse rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
        {error ?? t("common.error.notFound")}
      </p>
    );
  }

  const overviewItems = [
    [t("authz.appDetail.overview.status"), app.status],
    [t("authz.appDetail.overview.createdAt"), app.created_at],
    [t("authz.appDetail.overview.updatedAt"), app.updated_at],
  ];

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.appDetail.description")}
        title={app.name}
      />
      <section className="flex flex-col gap-4 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">
              {app.name}
            </h2>
            <StatusBadge status={app.status} />
          </div>
          <p className="mt-2 text-sm text-[var(--dashboard-muted)]">
            {app.code}
          </p>
        </div>
        <Button href={routes.appSettings(appId)} variant="secondary">
          {t("authz.appDetail.edit")}
        </Button>
      </section>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="overview" appId={appId} />
        <section className="grid flex-1 gap-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {overviewItems.map(([label, value]) => (
              <article
                className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5"
                key={label}
              >
                <p className="text-sm text-[var(--dashboard-muted)]">{label}</p>
                <strong className="mt-2 block text-lg font-semibold text-[var(--dashboard-text)]">
                  {value}
                </strong>
              </article>
            ))}
          </div>
          <article className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5">
            <h3 className="text-lg font-semibold text-[var(--dashboard-text)]">
              {t("authz.appDetail.overview.integrationHint")}
            </h3>
            <pre className="mt-4 overflow-auto rounded-xl bg-[var(--dashboard-field)] p-4 text-sm text-[var(--dashboard-muted-strong)]">
{`OPENAUTH_APP_CODE=${app.code}
OPENAUTH_AUTHZ_URL=https://authz.example.com
OPENAUTH_MENU_PATH=/v1/apps/${app.code}/menu`}
            </pre>
          </article>
        </section>
      </div>
    </div>
  );
}
