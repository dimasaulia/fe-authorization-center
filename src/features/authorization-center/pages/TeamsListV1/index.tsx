"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { AuthCenterNav } from "../../components/AuthCenterNav";
import { StatusBadge } from "../../components/StatusBadge";
import type { Team } from "../../modules/teams/teams.type";
import { useTeamsListController } from "./controller/useTeamsListController";

export function TeamsListV1() {
  const { t } = usePreferences();
  const { teams, error, isLoading, search, setSearch, reload } =
    useTeamsListController();

  const columns: DataTableColumn<Team>[] = [
    {
      key: "name",
      label: "Team Name",
      width: "1.2fr",
      render: (row) => (
        <strong className="text-[var(--dashboard-text)]">{row.name}</strong>
      ),
    },
    {
      key: "code",
      label: "Team Code",
      width: "1fr",
      render: (row) => (
        <span className="font-mono text-[var(--dashboard-muted)]">{row.code}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "110px",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "created_at",
      label: "Created At",
      width: "160px",
      render: (row) => (
        <span className="text-[var(--dashboard-muted)]">
          {new Date(row.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "160px",
      render: (row) => (
        <span className="flex gap-3 text-xs font-semibold text-[var(--dashboard-accent)]">
          <Link href={routes.teamDetail(String(row.id))}>View</Link>
          <Link href={routes.teamCreate}>Edit</Link>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        actionHref={routes.teamCreate}
        actionLabel={t("authz.teams.create")}
        description={t("authz.teams.description")}
        title={t("authz.teams.title")}
      />

      {/* Search bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-4 py-3">
        <AppIcon className="h-4 w-4 shrink-0 text-[var(--dashboard-subtle)]" name="search" />
        <input
          className="flex-1 bg-transparent text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)]"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("authz.filter.search.teams")}
          type="search"
          value={search}
        />
        {search.length > 0 && (
          <button
            className="text-xs text-[var(--dashboard-muted)] hover:text-[var(--dashboard-text)]"
            onClick={() => setSearch("")}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <span>{error}</span>
          <button className="font-semibold underline" onClick={reload} type="button">
            Retry
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        emptyMessage={search ? `No teams found for "${search}"` : "No teams yet."}
        getRowKey={(row) => String(row.id)}
        isLoading={isLoading}
        minWidth="700px"
        rows={teams}
        title="Teams"
      />

      <p className="text-sm text-[var(--dashboard-muted)]">
        {isLoading ? "Loading..." : `${teams.length} team${teams.length !== 1 ? "s" : ""} found`}
      </p>
    </div>
  );
}
