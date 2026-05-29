"use client";

import { usePreferences } from "@/modules/preferences";

import { AuthCenterHeader } from "../../../authorization-center/components/AuthCenterHeader";
import { AuthCenterNav } from "../../../authorization-center/components/AuthCenterNav";
import { useUserCreateController } from "./controller/useUserCreateController";
import type { Role } from "../../../authorization-center/modules/roles/roles.type";
import type { Team } from "../../../authorization-center/modules/teams/teams.type";

export function UserCreateV1() {
  const { t } = usePreferences();
  const {
    username, setUsername,
    email, setEmail,
    displayName, setDisplayName,
    password, setPassword,
    status, setStatus,
    mustChangePassword, setMustChangePassword,
    sendInvitation, setSendInvitation,
    availableRoles, assignedRoles,
    roleSearch, roleSearchLoading,
    handleRoleSearch, assignRole, unassignRole,
    draggingRole,
    onRoleDragStart, onRoleDragEnd,
    onRoleDropToAssigned, onRoleDropToAvailable,
    availableTeams, assignedTeams,
    teamSearch, teamSearchLoading,
    handleTeamSearch, assignTeam, unassignTeam,
    draggingTeam,
    onTeamDragStart, onTeamDragEnd,
    onTeamDropToAssigned, onTeamDropToAvailable,
    isSubmitting, submitError,
    submit, cancel,
  } = useUserCreateController();

  const inputCls = "h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]";
  const labelCls = "mb-1.5 block text-sm font-medium text-[var(--dashboard-muted-strong)]";

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("users.create.description")}
        title={t("users.create.title")}
      />

      <AuthCenterNav active="users" />

      <div className="space-y-5">
        {submitError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </p>
        )}

        {/* ── Identity card ── */}
        <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[var(--dashboard-text)]">
            {t("users.create.formTitle")}
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Display Name */}
            <label className="block">
              <span className={labelCls}>{t("users.create.displayNameLabel")} <span className="text-red-500">*</span></span>
              <input
                autoFocus
                className={inputCls}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t("users.create.displayNamePlaceholder")}
                type="text"
                value={displayName}
              />
            </label>

            {/* Username */}
            <label className="block">
              <span className={labelCls}>{t("users.create.usernameLabel")} <span className="text-red-500">*</span></span>
              <input
                className={inputCls}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("users.create.usernamePlaceholder")}
                type="text"
                value={username}
              />
            </label>

            {/* Email */}
            <label className="block sm:col-span-2">
              <span className={labelCls}>{t("users.create.emailLabel")} <span className="text-red-500">*</span></span>
              <input
                className={inputCls}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("users.create.emailPlaceholder")}
                type="email"
                value={email}
              />
            </label>
          </div>

          {/* Status toggle */}
          <fieldset>
            <legend className={labelCls}>{t("users.create.statusLabel")}</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(["active", "invited"] as const).map((s) => (
                <button
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${status === s ? "border-[var(--dashboard-accent-border)] bg-[var(--dashboard-accent-soft)]" : "border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] hover:border-[var(--dashboard-border)]"}`}
                  key={s}
                  onClick={() => setStatus(s)}
                  type="button"
                >
                  <span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${status === s ? "border-[var(--dashboard-accent)] bg-[var(--dashboard-accent)]" : "border-[var(--dashboard-border-soft)]"}`} />
                  <span className="text-sm font-medium text-[var(--dashboard-text)]">
                    {t(s === "active" ? "users.create.statusActive" : "users.create.statusInvited")}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Password — only for active */}
          {status === "active" && (
            <label className="block">
              <span className={labelCls}>{t("users.create.passwordLabel")} <span className="text-red-500">*</span></span>
              <input
                className={inputCls}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("users.create.passwordPlaceholder")}
                type="password"
                value={password}
              />
            </label>
          )}

          {/* Checkboxes */}
          <div className="space-y-2.5">
            {status === "active" && (
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  checked={mustChangePassword}
                  className="h-4 w-4 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                  onChange={(e) => setMustChangePassword(e.target.checked)}
                  type="checkbox"
                />
                <span className="text-sm text-[var(--dashboard-text)]">{t("users.create.mustChangePassword")}</span>
              </label>
            )}
            {status === "invited" && (
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  checked={sendInvitation}
                  className="h-4 w-4 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                  onChange={(e) => setSendInvitation(e.target.checked)}
                  type="checkbox"
                />
                <span className="text-sm text-[var(--dashboard-text)]">{t("users.create.sendInvitation")}</span>
              </label>
            )}

          </div>
        </div>

        {/* ── Role assignment ── */}
        <AssignmentPanel
          assignedItems={assignedRoles}
          assignedTitle={t("users.create.assignedRoles")}
          availableItems={availableRoles}
          availableTitle={t("users.create.availableRoles")}
          dragHint={t("users.create.dragHint")}
          draggingItem={draggingRole}
          getItemCode={(r: Role) => r.code}
          getItemId={(r: Role) => r.id}
          getItemLabel={(r: Role) => r.name}
          getItemSublabel={(r: Role) => r.scope}
          isLoading={roleSearchLoading}
          onAssign={(item) => assignRole(item as Role)}
          onDragEnd={onRoleDragEnd}
          onDragStart={(item) => onRoleDragStart(item as Role)}
          onDropToAssigned={onRoleDropToAssigned}
          onDropToAvailable={onRoleDropToAvailable}
          onSearch={handleRoleSearch}
          onUnassign={(item) => unassignRole(item as Role)}
          search={roleSearch}
          searchPlaceholder={t("users.create.searchRoles")}
          title={t("users.create.rolesTitle")}
        />

        {/* ── Team assignment ── */}
        <AssignmentPanel
          assignedItems={assignedTeams}
          assignedTitle={t("users.create.assignedTeams")}
          availableItems={availableTeams}
          availableTitle={t("users.create.availableTeams")}
          dragHint={t("users.create.dragHint")}
          draggingItem={draggingTeam}
          getItemCode={(t: Team) => t.code}
          getItemId={(t: Team) => t.id}
          getItemLabel={(t: Team) => t.name}
          getItemSublabel={(t: Team) => t.status}
          isLoading={teamSearchLoading}
          onAssign={(item) => assignTeam(item as Team)}
          onDragEnd={onTeamDragEnd}
          onDragStart={(item) => onTeamDragStart(item as Team)}
          onDropToAssigned={onTeamDropToAssigned}
          onDropToAvailable={onTeamDropToAvailable}
          onSearch={handleTeamSearch}
          onUnassign={(item) => unassignTeam(item as Team)}
          search={teamSearch}
          searchPlaceholder={t("users.create.searchTeams")}
          title={t("users.create.teamsTitle")}
        />

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--dashboard-border-soft)] pt-5">
          <button
            className="rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-4 py-2 text-sm font-semibold text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            onClick={cancel}
            type="button"
          >
            {t("authz.form.cancel")}
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-hero-border bg-hero px-4 py-2 text-sm font-semibold text-white transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || !username || !email || !displayName}
            onClick={submit}
            type="button"
          >
            {isSubmitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {t("authz.form.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Generic dual-panel assignment component ──
type AssignmentPanelProps<T> = {
  title: string;
  availableTitle: string;
  assignedTitle: string;
  availableItems: T[];
  assignedItems: T[];
  search: string;
  searchPlaceholder: string;
  isLoading: boolean;
  dragHint: string;
  draggingItem: T | null;
  getItemId: (item: T) => number;
  getItemLabel: (item: T) => string;
  getItemCode: (item: T) => string;
  getItemSublabel: (item: T) => string;
  onSearch: (q: string) => void;
  onAssign: (item: T) => void;
  onUnassign: (item: T) => void;
  onDragStart: (item: T) => void;
  onDragEnd: () => void;
  onDropToAssigned: () => void;
  onDropToAvailable: () => void;
};

function AssignmentPanel<T>({
  title,
  availableTitle,
  assignedTitle,
  availableItems,
  assignedItems,
  search,
  searchPlaceholder,
  isLoading,
  dragHint,
  draggingItem,
  getItemId,
  getItemLabel,
  getItemCode,
  getItemSublabel,
  onSearch,
  onAssign,
  onUnassign,
  onDragStart,
  onDragEnd,
  onDropToAssigned,
  onDropToAvailable,
}: AssignmentPanelProps<T>) {
  return (
    <div className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-6 space-y-4">
      <h2 className="text-sm font-semibold text-[var(--dashboard-text)]">{title}</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Available panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--dashboard-muted)]">{availableTitle}</span>
            {draggingItem && (
              <span className="text-xs text-[var(--dashboard-muted)]">{dragHint}</span>
            )}
          </div>

          <input
            className="h-9 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={search}
          />

          <div
            className="min-h-40 rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] p-2 space-y-1"
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropToAvailable}
          >
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--dashboard-accent)] border-t-transparent" />
              </div>
            )}
            {!isLoading && availableItems.length === 0 && (
              <p className="py-4 text-center text-xs text-[var(--dashboard-muted)]">—</p>
            )}
            {!isLoading && availableItems.map((item) => (
              <button
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-transparent bg-[var(--dashboard-panel)] px-3 py-2 text-left transition hover:border-[var(--dashboard-accent-border)] hover:bg-[var(--dashboard-accent-soft)]"
                draggable
                key={getItemId(item)}
                onClick={() => onAssign(item)}
                onDragEnd={onDragEnd}
                onDragStart={() => onDragStart(item)}
                type="button"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--dashboard-text)]">{getItemLabel(item)}</p>
                  <p className="truncate font-mono text-[10px] text-[var(--dashboard-muted)]">{getItemCode(item)}</p>
                </div>
                <span className="ml-2 shrink-0 inline-flex items-center rounded border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--dashboard-muted-strong)]">
                  {getItemSublabel(item)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Assigned panel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--dashboard-muted)]">{assignedTitle}</span>
            {assignedItems.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-[var(--dashboard-accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--dashboard-accent)]">
                {assignedItems.length}
              </span>
            )}
          </div>

          {/* Spacer to align with search input */}
          <div className="h-9" />

          <div
            className={`min-h-40 rounded-xl border p-2 space-y-1 transition ${draggingItem ? "border-[var(--dashboard-accent-border)] bg-[var(--dashboard-accent-soft)]" : "border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)]"}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropToAssigned}
          >
            {assignedItems.length === 0 && (
              <p className="py-4 text-center text-xs text-[var(--dashboard-muted)]">—</p>
            )}
            {assignedItems.map((item) => (
              <button
                className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-[var(--dashboard-accent-border)] bg-[var(--dashboard-panel)] px-3 py-2 text-left transition hover:border-red-300 hover:bg-red-50"
                key={getItemId(item)}
                onClick={() => onUnassign(item)}
                type="button"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[var(--dashboard-text)]">{getItemLabel(item)}</p>
                  <p className="truncate font-mono text-[10px] text-[var(--dashboard-muted)]">{getItemCode(item)}</p>
                </div>
                <span className="ml-2 shrink-0 text-[10px] font-semibold text-red-500">✕</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
