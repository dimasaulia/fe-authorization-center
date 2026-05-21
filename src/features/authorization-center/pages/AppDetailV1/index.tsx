"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { StatusBadge } from "../../components/StatusBadge";
import {
  getAppCredentials,
  getAuthorizationApp,
} from "../../data/authorization-center.data";

type AppDetailV1Props = {
  appId: string;
};

export function AppDetailV1({ appId }: AppDetailV1Props) {
  const { t } = usePreferences();
  const app = getAuthorizationApp(appId);
  const credentials = getAppCredentials(app.id);

  const overviewItems = [
    [t("authz.appDetail.overview.credentialCount"), String(credentials.length)],
    [t("authz.appDetail.overview.ownerTeam"), app.ownerTeam],
    [t("authz.appDetail.overview.status"), app.status],
    [t("authz.appDetail.overview.createdAt"), app.createdAt],
    [t("authz.appDetail.overview.updatedAt"), app.updatedAt],
    [t("authz.appDetail.overview.environmentCount"), String(app.environmentCount)],
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
            {app.code} · {app.type}
          </p>
        </div>
        <Button href={routes.appSettings(app.id)} variant="secondary">
          {t("authz.appDetail.edit")}
        </Button>
      </section>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="overview" appId={app.id} />
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
