import { routes } from "@/config/routes.config";
import { Button } from "@/shared/components/Button";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { Field } from "../../components/Field";
import {
  appTypes,
  getAppCredentials,
  getAuthorizationApp,
  statuses,
  teams,
} from "../../data/authorization-center.data";

type AppSettingsV1Props = {
  appId: string;
};

export function AppSettingsV1({ appId }: AppSettingsV1Props) {
  const app = getAuthorizationApp(appId);
  const credentials = getAppCredentials(app.id);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description="Edit app metadata while keeping technical identity fields protected."
        title="Settings"
      />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="settings" appId={app.id} />
        <section className="min-w-0 flex-1 space-y-5">
          <form className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5">
            <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">Editable fields</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="App Name" name="name" placeholder={app.name} required />
              <Field label="App Type" name="type" options={appTypes} required type="select" />
              <Field label="Owner Team" name="ownerTeam" options={teams.map((team) => team.name)} type="select" />
              <Field label="Status" name="status" options={statuses} type="select" />
              <Field label="Description" name="description" placeholder={app.description} type="textarea" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button href={routes.appDetail(app.id)} variant="secondary">Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>

          <section className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5">
            <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">Readonly fields</h2>
            <dl className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                ["App Code", app.code],
                ["Created At", app.createdAt],
                ["Updated At", app.updatedAt],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-[var(--dashboard-muted)]">{label}</dt>
                  <dd className="mt-1 font-semibold text-[var(--dashboard-text)]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950">
            <h2 className="text-lg font-semibold">Danger zone</h2>
            <p className="mt-2 text-sm leading-6">
              Disable app immediately blocks new authorization usage. Delete is only allowed when there are no credentials, permissions, or user assignments.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="h-10 rounded-xl border border-red-300 bg-white px-4 text-sm font-semibold" type="button">
                Disable App
              </button>
              <button
                className="h-10 rounded-xl bg-red-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={credentials.length > 0}
                type="button"
              >
                Delete App
              </button>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
