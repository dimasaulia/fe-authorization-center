import Link from "next/link";

import { routes } from "@/config/routes.config";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { AuthCenterNav } from "../../components/AuthCenterNav";
import { FilterBar } from "../../components/FilterBar";
import { StatusBadge } from "../../components/StatusBadge";
import { teams } from "../../data/authorization-center.data";

export function TeamsListV1() {
  return (
    <div className="space-y-6">
      <AuthCenterHeader
        actionHref={routes.teamCreate}
        actionLabel="Create Team"
        description="Group users across apps or organization boundaries before wiring app roles."
        title="Teams"
      />
      <AuthCenterNav active="teams" />
      <FilterBar searchPlaceholder="Search by team name or code" secondaryFilterLabel="Organization" secondaryFilterOptions={["Internal Organization"]} />
      <section className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)]">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[1.2fr_1fr_1.2fr_110px_120px_130px_180px] border-b border-[var(--dashboard-border-soft)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.04em] text-[var(--dashboard-muted)]">
            <span>Team Name</span>
            <span>Team Code</span>
            <span>Organization</span>
            <span>Status</span>
            <span>Member Count</span>
            <span>Created At</span>
            <span>Actions</span>
          </div>
          {teams.map((team) => (
            <div className="grid grid-cols-[1.2fr_1fr_1.2fr_110px_120px_130px_180px] items-center border-b border-[var(--dashboard-border-soft)] px-4 py-4 text-sm last:border-b-0" key={team.id}>
              <strong>{team.name}</strong>
              <span className="text-[var(--dashboard-muted)]">{team.code}</span>
              <span>{team.organization}</span>
              <StatusBadge status={team.status} />
              <span>{team.memberCount}</span>
              <span>{team.createdAt}</span>
              <span className="flex gap-3 text-xs font-semibold text-[var(--dashboard-accent)]">
                <Link href={routes.teamDetail(team.id)}>View Detail</Link>
                <Link href={routes.teamCreate}>Edit</Link>
                <button className="text-[var(--dashboard-muted)]" type="button">{team.status === "active" ? "Disable" : "Enable"}</button>
              </span>
            </div>
          ))}
        </div>
      </section>
      <p className="text-sm text-[var(--dashboard-muted)]">Page 1 of 1</p>
    </div>
  );
}
