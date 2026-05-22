"use client";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";

import { AppDetailTabs } from "../../components/AppDetailTabs";
import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { Field } from "../../components/Field";
import { appTypes, statuses, teams } from "../../data/authorization-center.data";
import { useAppSettingsController } from "./controller/useAppSettingsController";

type AppSettingsV1Props = {
  appId: string;
};

export function AppSettingsV1({ appId }: AppSettingsV1Props) {
  const { t } = usePreferences();
  const { app, isLoading, error } = useAppSettingsController(appId);

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
        description={t("authz.settings.description")}
        title={t("authz.appDetail.tabs.settings")}
      />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <AppDetailTabs active="settings" appId={appId} />
        <section className="min-w-0 flex-1 space-y-5">
          <form className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5">
            <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">
              {t("authz.settings.editableFields")}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="App Name" name="name" placeholder={app.name} required />
              <Field label="App Type" name="type" options={appTypes} required type="select" />
              <Field label="Owner Team" name="ownerTeam" options={teams.map((team) => team.name)} type="select" />
              <Field label="Status" name="status" options={statuses} type="select" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button href={routes.appDetail(appId)} variant="secondary">
                {t("authz.form.cancel")}
              </Button>
              <Button type="submit">{t("authz.form.save")}</Button>
            </div>
          </form>

          <section className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5">
            <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">
              {t("authz.settings.readonlyFields")}
            </h2>
            <dl className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                ["App Code", app.code],
                ["Created At", app.created_at],
                ["Updated At", app.updated_at],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-[var(--dashboard-muted)]">{label}</dt>
                  <dd className="mt-1 font-semibold text-[var(--dashboard-text)]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-950">
            <h2 className="text-lg font-semibold">{t("authz.settings.dangerZone")}</h2>
            <p className="mt-2 text-sm leading-6">{t("authz.settings.dangerDescription")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="h-10 rounded-xl border border-red-300 bg-white px-4 text-sm font-semibold"
                type="button"
              >
                {t("authz.settings.disableApp")}
              </button>
              <button
                className="h-10 rounded-xl bg-red-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
              >
                {t("authz.settings.deleteApp")}
              </button>
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
