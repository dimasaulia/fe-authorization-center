"use client";

import { useState } from "react";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { AuthCenterNav } from "../../components/AuthCenterNav";
import { useRoleCreateController } from "./controller/useRoleCreateController";

export function RoleCreateV1() {
  const { t } = usePreferences();
  const { error, isSubmitting, slugify, submit } = useRoleCreateController();

  const [name, setName] = useState("");
  const [codeOverride, setCodeOverride] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSystem, setIsSystem] = useState(false);
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const code = codeOverride ?? slugify(name);

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.roleCreate.description")}
        title={t("authz.roleCreate.title")}
      />

      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_3px_var(--dashboard-shadow)]">
          <div className="flex items-center gap-3 border-b border-[var(--dashboard-border-soft)] px-6 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-subtle)]">
              <AppIcon className="h-5 w-5" name="shield" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--dashboard-text)]">
                {t("authz.roleCreate.formTitle")}
              </h2>
              <p className="text-xs text-[var(--dashboard-muted)]">{t("authz.form.required")}</p>
            </div>
          </div>

          <div className="space-y-5 px-6 py-6">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                {t("authz.roleCreate.nameLabel")} <span className="text-red-500">*</span>
              </span>
              <input
                autoFocus
                className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                onChange={(e) => setName(e.target.value)}
                placeholder={t("authz.roleCreate.namePlaceholder")}
                required
                type="text"
                value={name}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                {t("authz.roleCreate.codeLabel")} <span className="text-red-500">*</span>
              </span>
              <div className="relative">
                <input
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 pr-16 font-mono text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  onChange={(e) => setCodeOverride(slugify(e.target.value) || null)}
                  placeholder="admin"
                  required
                  type="text"
                  value={code}
                />
                {codeOverride === null && name.length > 0 && (
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-[var(--dashboard-accent-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--dashboard-accent)]">
                    auto
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-xs text-[var(--dashboard-subtle)]">{t("authz.roleCreate.codeHint")}</p>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                {t("authz.roleCreate.descriptionLabel")}
              </span>
              <input
                className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("authz.roleCreate.descriptionPlaceholder")}
                type="text"
                value={description}
              />
            </label>

            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">Status</legend>
              <div className="flex gap-3">
                {(["active", "inactive"] as const).map((s) => (
                  <button
                    className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${status === s ? s === "active" ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-slate-50 text-slate-600" : "border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-muted)] hover:border-[var(--dashboard-border)]"}`}
                    key={s}
                    onClick={() => setStatus(s)}
                    type="button"
                  >
                    <span className={`h-2 w-2 rounded-full ${s === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex items-center gap-3">
              <input
                checked={isSystem}
                className="h-4 w-4 rounded border-[var(--dashboard-border-soft)] accent-[var(--dashboard-accent)]"
                id="is_system_global"
                onChange={(e) => setIsSystem(e.target.checked)}
                type="checkbox"
              />
              <label className="text-sm text-[var(--dashboard-muted-strong)]" htmlFor="is_system_global">
                {t("authz.roleCreate.isSystemLabel")}
              </label>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[var(--dashboard-border-soft)] px-6 py-4">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-5 text-sm font-semibold text-[var(--dashboard-muted-strong)] transition hover:bg-[var(--dashboard-panel-subtle)]"
              href={routes.roles}
            >
              {t("authz.form.cancel")}
            </a>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hero-border bg-hero px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !name || !code}
              onClick={() => void submit({ name, code, description, is_system: isSystem, status })}
              type="button"
            >
              {isSubmitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Saving...</> : t("authz.form.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
