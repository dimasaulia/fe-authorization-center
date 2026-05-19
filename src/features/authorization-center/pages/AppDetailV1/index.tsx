import { routes } from "@/config/routes.config";
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
  const app = getAuthorizationApp(appId);
  const credentials = getAppCredentials(app.id);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description="Review app identity, integration readiness, and available configuration areas."
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
          Edit
        </Button>
      </section>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="overview" appId={app.id} />
        <section className="grid flex-1 gap-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              ["Credential count", String(credentials.length)],
              ["Owner team", app.ownerTeam],
              ["Status", app.status],
              ["Created at", app.createdAt],
              ["Updated at", app.updatedAt],
              ["Environment count", String(app.environmentCount)],
            ].map(([label, value]) => (
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
              Integration hint / SDK config preview
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
