import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { teams } from "../../data/authorization-center.data";

type TeamDetailV1Props = {
  teamId: string;
};

const tabs = ["Overview", "Members", "App Roles", "Audit"];

export function TeamDetailV1({ teamId }: TeamDetailV1Props) {
  const team = teams.find((item) => item.id === teamId) ?? teams[0];

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description="Review team identity and membership foundation before app roles are connected."
        title={team.name}
      />
      <nav className="flex flex-wrap gap-2 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-2">
        {tabs.map((tab, index) => (
          <span
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              index === 0
                ? "bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]"
                : index === 1
                  ? "text-[var(--dashboard-muted)]"
                  : "cursor-not-allowed text-[var(--dashboard-subtle)] opacity-60"
            }`}
            key={tab}
          >
            {tab}{index > 1 ? " · Coming soon" : ""}
          </span>
        ))}
      </nav>
      <section className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">
              Team identity
            </h2>
            <p className="mt-1 text-sm text-[var(--dashboard-muted)]">
              {team.code} · {team.organization}
            </p>
          </div>
          <StatusBadge status={team.status} />
        </div>
        <dl className="mt-5 grid gap-4 md:grid-cols-4">
          {[
            ["Organization", team.organization],
            ["Status", team.status],
            ["Member count", String(team.memberCount)],
            ["Created at", team.createdAt],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-[var(--dashboard-muted)]">{label}</dt>
              <dd className="mt-1 font-semibold text-[var(--dashboard-text)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
