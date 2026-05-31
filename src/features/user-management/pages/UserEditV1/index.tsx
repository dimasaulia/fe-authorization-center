"use client";

import { usePreferences } from "@/modules/preferences";

import { AuthCenterHeader } from "../../../authorization-center/components/AuthCenterHeader";
import { AssignmentPanel } from "../../components/AssignmentPanel";
import { useUserEditController } from "./controller/useUserEditController";
import type { Role } from "../../../authorization-center/modules/roles/roles.type";
import type { Team } from "../../../authorization-center/modules/teams/teams.type";

type UserEditV1Props = {
  userId: string;
};

export function UserEditV1({ userId }: UserEditV1Props) {
  const { t } = usePreferences();
  const {
    cancel,
    availableRoles,
    assignedRoles,
    roleSearch,
    roleSearchLoading,
    handleRoleSearch,
    assignRole,
    unassignRole,
    draggingRole,
    onRoleDragStart,
    onRoleDragEnd,
    onRoleDropToAssigned,
    onRoleDropToAvailable,
    availableTeams,
    assignedTeams,
    teamSearch,
    teamSearchLoading,
    handleTeamSearch,
    assignTeam,
    unassignTeam,
    draggingTeam,
    onTeamDragStart,
    onTeamDragEnd,
    onTeamDropToAssigned,
    onTeamDropToAvailable,
    displayName,
    email,
    error,
    isLoading,
    isSubmitting,
    mustChangePassword,
    password,
    setDisplayName,
    setEmail,
    setMustChangePassword,
    setPassword,
    setStatus,
    setUsername,
    status,
    submit,
    username,
  } = useUserEditController(userId);

  const inputCls = "h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]";
  const labelCls = "mb-1.5 block text-sm font-medium text-[var(--dashboard-muted-strong)]";

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("users.edit.description")}
        title={t("users.edit.title")}
      />

      <div className="space-y-5">
        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="space-y-5 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[var(--dashboard-text)]">
                {t("users.edit.formTitle")}
              </h2>
              <p className="mt-1 font-mono text-xs text-[var(--dashboard-muted)]">
                {t("users.edit.userId")}: {userId}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  className="h-11 animate-pulse rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)]"
                  key={item}
                />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className={labelCls}>{t("users.create.displayNameLabel")} <span className="text-red-500">*</span></span>
                  <input
                    autoFocus
                    className={inputCls}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder={t("users.create.displayNamePlaceholder")}
                    type="text"
                    value={displayName}
                  />
                </label>

                <label className="block">
                  <span className={labelCls}>{t("users.create.usernameLabel")} <span className="text-red-500">*</span></span>
                  <input
                    className={inputCls}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder={t("users.create.usernamePlaceholder")}
                    type="text"
                    value={username}
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className={labelCls}>{t("users.create.emailLabel")} <span className="text-red-500">*</span></span>
                  <input
                    className={inputCls}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t("users.create.emailPlaceholder")}
                    type="email"
                    value={email}
                  />
                </label>
              </div>

              <fieldset>
                <legend className={labelCls}>{t("users.create.statusLabel")}</legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {(["active", "inactive", "invited"] as const).map((nextStatus) => (
                    <button
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${status === nextStatus ? "border-[var(--dashboard-accent-border)] bg-[var(--dashboard-accent-soft)]" : nextStatus !== "invited" ? "border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] hover:border-[var(--dashboard-border)]" : "border-slate-50 bg-slate-100 hover:border-[var(--dashboard-border)] disabled:cursor-not-allowed"}`}
                      key={nextStatus}
                      onClick={() => setStatus(nextStatus)}
                      type="button"
                      disabled={nextStatus === "invited"}
                    >
                      <span className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${status === nextStatus ? "border-[var(--dashboard-accent)] bg-[var(--dashboard-accent)]" : "border-[var(--dashboard-border-soft)]"}`} />
                      <span className="text-sm font-medium capitalize text-[var(--dashboard-text)]">
                        {nextStatus}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="block">
                <span className={labelCls}>{t("users.edit.passwordLabel")}</span>
                <input
                  className={inputCls}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("users.edit.passwordPlaceholder")}
                  type="password"
                  value={password}
                />
                <p className="mt-1.5 text-xs text-[var(--dashboard-subtle)]">
                  {t("users.edit.passwordHelp")}
                </p>
              </label>

              {/* <label className="flex cursor-pointer items-center gap-3">
                <input
                  checked={mustChangePassword}
                  className="h-4 w-4 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                  onChange={(event) => setMustChangePassword(event.target.checked)}
                  type="checkbox"
                />
                <span className="text-sm text-[var(--dashboard-text)]">
                  {t("users.create.mustChangePassword")}
                </span>
              </label> */}
            </>
          )}
        </div>

        {!isLoading && (
          <>
            <AssignmentPanel
              assignedItems={assignedRoles}
              assignedTitle={t("users.create.assignedRoles")}
              availableItems={availableRoles}
              availableTitle={t("users.create.availableRoles")}
              dragHint={t("users.create.dragHint")}
              draggingItem={draggingRole}
              getItemCode={(role: Role) => role.code}
              getItemId={(role: Role) => role.id}
              getItemLabel={(role: Role) => role.name}
              getItemSublabel={(role: Role) => [role.scope, role.app_code].filter(Boolean).join(" / ")}
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

            <AssignmentPanel
              assignedItems={assignedTeams}
              assignedTitle={t("users.create.assignedTeams")}
              availableItems={availableTeams}
              availableTitle={t("users.create.availableTeams")}
              dragHint={t("users.create.dragHint")}
              draggingItem={draggingTeam}
              getItemCode={(team: Team) => team.code}
              getItemId={(team: Team) => team.id}
              getItemLabel={(team: Team) => team.name}
              getItemSublabel={(team: Team) => team.status}
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
          </>
        )}

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
            disabled={isLoading || isSubmitting || !username || !email || !displayName}
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
