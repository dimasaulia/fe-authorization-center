import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

import { accessStats, notifications } from "../constants/dashboard-home.constant";

export function DashboardWidgetsSection() {
  const { t } = usePreferences();

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,58fr)_minmax(360px,42fr)]">
      <article className="relative overflow-hidden rounded-3xl border border-[var(--dashboard-border)] bg-[linear-gradient(145deg,var(--dashboard-panel)_0%,var(--dashboard-bg)_100%)] px-[18px] py-[18px] shadow-[0_18px_48px_var(--dashboard-accent-shadow)]">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-sm leading-[18px] text-[var(--dashboard-muted)]">
              {t("dashboard.todayDate")}
              <span className="ml-2 inline-flex h-1 w-1 rounded-full bg-[#EF4444] align-middle" />
            </p>
            <h2 className="mt-1 text-[32px] font-semibold leading-[1.12] text-[var(--dashboard-text)]">
              {t("dashboard.today")}
            </h2>
          </div>
          <button
            aria-label="Notification filter"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] text-[var(--dashboard-text)]"
            type="button"
          >
            <AppIcon className="h-[18px] w-[18px]" name="menu" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5 rounded-[18px] bg-[var(--dashboard-panel)] p-3 shadow-[0_10px_30px_var(--dashboard-shadow)]">
          {notifications.map((notification) => (
            <div
              className="flex items-start gap-3 rounded-[14px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] px-3 py-3.5"
              key={notification.titleKey}
            >
              <span className="relative mt-1 flex h-10 w-4 justify-center">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${notification.tone}`}
                />
                <span className="absolute top-4 h-7 w-px bg-[var(--dashboard-border-soft)]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold leading-4 text-[var(--dashboard-accent)]">
                    {t(notification.titleKey)}
                  </p>
                  <p className="text-xs leading-4 text-[var(--dashboard-subtle)]">
                    {t(notification.timeKey)}
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium leading-[1.35] text-[var(--dashboard-text)]">
                  {t(notification.descriptionKey)}
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
              {t("dashboard.access.status")}
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
                {t("dashboard.access.description")}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-[var(--dashboard-accent-soft-border)] bg-[var(--dashboard-accent-soft)] px-2.5 py-1.5 text-xs font-medium leading-4 text-[var(--dashboard-accent)]">
              {t("dashboard.access.group")}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[13px] leading-4 text-[var(--dashboard-muted)]">
            <AppIcon className="h-4 w-4 text-[#0F766E]" name="shield" />
            <span>{t("dashboard.access.lastLogin")}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-[18px] py-5 md:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
          {accessStats.map((stat) => (
            <div
              className="rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-2 py-2.5"
              key={stat.labelKey}
            >
              <p className="text-xl font-semibold leading-none text-[var(--dashboard-text)]">
                {stat.value}
              </p>
              <p className="mt-1 text-[11px] leading-[14px] text-[var(--dashboard-muted)]">
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
