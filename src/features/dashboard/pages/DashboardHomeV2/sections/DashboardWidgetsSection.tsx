import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

import type { DashboardAccessSummary } from "../controller/useDashboardHomeController";

type DashboardWidgetsSectionProps = {
  accessSummary: DashboardAccessSummary;
  error: string | null;
  isLoading: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardWidgetsSection({
  accessSummary,
  error,
  isLoading,
}: DashboardWidgetsSectionProps) {
  const { language, t } = usePreferences();
  const user = accessSummary.user;
  const labels =
    language === "id"
      ? {
          account: "Akun",
          activeApps: "Aplikasi aktif",
          appsEmpty: "Belum ada aplikasi yang dapat diakses.",
          appsTitle: "Aplikasi yang bisa diakses",
          loading: "Memuat profil...",
          permission: "izin",
          permissions: "Total permission",
          primaryProvider: "Provider utama",
          providers: "Provider",
          signedInAs: "Masuk sebagai",
          status: "Status akun",
        }
      : {
          account: "Account",
          activeApps: "Active apps",
          appsEmpty: "No accessible apps yet.",
          appsTitle: "Accessible apps",
          loading: "Loading profile...",
          permission: "permissions",
          permissions: "Total permissions",
          primaryProvider: "Primary provider",
          providers: "Providers",
          signedInAs: "Signed in as",
          status: "Account status",
        };
  const displayName = user?.display_name ?? "-";
  const email = user?.email ?? "-";
  const username = user?.username ?? "-";

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,58fr)_minmax(360px,42fr)]">
      <article className="relative overflow-hidden rounded-3xl border border-[var(--dashboard-border)] bg-[linear-gradient(145deg,var(--dashboard-panel)_0%,var(--dashboard-bg)_100%)] px-[18px] py-[18px] shadow-[0_18px_48px_var(--dashboard-accent-shadow)]">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-sm leading-[18px] text-[var(--dashboard-muted)]">
              {labels.account}
              <span className="ml-2 inline-flex h-1 w-1 rounded-full bg-[#EF4444] align-middle" />
            </p>
            <h2 className="mt-1 text-[32px] font-semibold leading-[1.12] text-[var(--dashboard-text)]">
              {isLoading ? labels.loading : displayName}
            </h2>
          </div>
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[var(--dashboard-accent-soft)] text-sm font-bold text-[var(--dashboard-accent)]">
            {user ? getInitials(displayName) : <AppIcon className="h-5 w-5" name="user" />}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 rounded-[18px] bg-[var(--dashboard-panel)] p-3 shadow-[0_10px_30px_var(--dashboard-shadow)]">
          {error && (
            <div className="rounded-[14px] border border-red-200 bg-red-50 px-3 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {!error && [
            {
              icon: "user" as const,
              label: labels.signedInAs,
              value: email,
            },
            {
              icon: "shield" as const,
              label: labels.status,
              value: user?.status ?? "-",
            },
            {
              icon: "briefcase" as const,
              label: labels.primaryProvider,
              value: accessSummary.primaryProvider,
            },
          ].map((item) => (
            <div
              className="flex items-start gap-3 rounded-[14px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] px-3 py-3.5"
              key={item.label}
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--dashboard-field)] text-[var(--dashboard-accent)]">
                <AppIcon className="h-4 w-4" name={item.icon} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold leading-4 text-[var(--dashboard-accent)]">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-sm font-medium leading-[1.35] text-[var(--dashboard-text)]">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="overflow-hidden rounded-3xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_12px_36px_var(--dashboard-shadow)]">
        <div className="relative h-[104px] overflow-hidden bg-[image:var(--dashboard-access-header)]">
          <div className="absolute inset-x-0 bottom-0 h-[58px] bg-gradient-to-b from-transparent to-[var(--dashboard-panel)]" />
          <div className="absolute right-8 top-7 h-[132px] w-[132px] rounded-full bg-[var(--dashboard-accent-soft)]" />
          <div className="absolute left-6 top-6 inline-flex items-center gap-2.5 rounded-full border border-white/70 bg-white/75 px-3 py-2 shadow-[0_10px_24px_#0F172A14] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[var(--auth-success)]" />
            <span className="text-[13px] font-semibold leading-4 text-[#334155]">
              {user?.type ?? t("dashboard.access.status")}
            </span>
          </div>
        </div>

        <div className="border-b border-[var(--dashboard-border-soft)] px-[18px] py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[19px] font-semibold leading-[1.2] text-[var(--dashboard-text)]">
                {t("dashboard.access.title")}
              </h2>
              <p className="mt-1 text-[13px] leading-[1.4] text-[var(--dashboard-muted)]">
                {username}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-[var(--dashboard-accent-soft-border)] bg-[var(--dashboard-accent-soft)] px-2.5 py-1.5 text-xs font-medium leading-4 text-[var(--dashboard-accent)]">
              {accessSummary.appAccessCount} {labels.activeApps}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[13px] leading-4 text-[var(--dashboard-muted)]">
            <AppIcon className="h-4 w-4 text-[#0F766E]" name="shield" />
            <span>{labels.providers}: {accessSummary.providerCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-[18px] py-5 md:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
          {[
            { label: labels.activeApps, value: accessSummary.appAccessCount },
            { label: labels.permissions, value: accessSummary.totalPermissions },
            { label: labels.providers, value: accessSummary.providerCount },
            { label: labels.status, value: user?.status ?? "-" },
          ].map((stat) => (
            <div
              className="rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-2 py-2.5"
              key={stat.label}
            >
              <p className="text-xl font-semibold leading-none text-[var(--dashboard-text)]">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] leading-[14px] text-[var(--dashboard-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--dashboard-border-soft)] px-[18px] py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--dashboard-muted)]">
            {labels.appsTitle}
          </p>
          <div className="flex flex-col gap-2">
            {accessSummary.apps.length === 0 && (
              <p className="rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3 py-2 text-sm text-[var(--dashboard-muted)]">
                {isLoading ? labels.loading : labels.appsEmpty}
              </p>
            )}
            {accessSummary.apps.map((app) => (
              <div
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3 py-2.5"
                key={app.code}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--dashboard-text)]">
                    {app.name}
                  </p>
                  <p className="truncate font-mono text-[11px] text-[var(--dashboard-muted)]">
                    {app.code}
                  </p>
                </div>
                <span className="shrink-0 rounded-lg bg-[var(--dashboard-panel)] px-2 py-1 text-xs font-semibold text-[var(--dashboard-accent)]">
                  {app.permission_count} {labels.permission}
                </span>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
