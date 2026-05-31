"use client";

import { usePreferences } from "@/modules/preferences";

import { AuthCenterHeader } from "../../../authorization-center/components/AuthCenterHeader";
import { AssignmentPanel } from "../../components/AssignmentPanel";
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
          getItemSublabel={(r: Role) => [r.scope, r.app_code].filter(Boolean).join(" / ")}
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
