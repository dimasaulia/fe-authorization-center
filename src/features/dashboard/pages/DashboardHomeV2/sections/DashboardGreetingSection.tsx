import { usePreferences } from "@/modules/preferences";

type DashboardGreetingSectionProps = {
  dateTime: string;
  greeting: string;
  isLoading: boolean;
};

export function DashboardGreetingSection({
  dateTime,
  greeting,
  isLoading,
}: DashboardGreetingSectionProps) {
  const { t } = usePreferences();

  return (
    <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
      <div className="flex max-w-[760px] flex-col gap-2">
        <p className="text-sm font-medium leading-[18px] text-[var(--dashboard-muted)]">
          {dateTime}
        </p>
        <h1 className="text-[34px] font-semibold leading-[1.08] text-[var(--dashboard-text)] md:text-[38px]">
          {isLoading ? t("dashboard.workspace") : greeting}
        </h1>
        <p className="text-[15px] leading-[1.45] text-[var(--dashboard-muted)]">
          {t("dashboard.description")}
        </p>
      </div>
      <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[var(--auth-success)]" />
        <span className="text-sm leading-[18px] text-[var(--dashboard-muted-strong)]">
          {t("dashboard.networkHealthy")}
        </span>
      </div>
    </section>
  );
}
