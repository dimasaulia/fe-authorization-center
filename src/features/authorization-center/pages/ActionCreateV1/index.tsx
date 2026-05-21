"use client";

import { useRef, useState } from "react";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

import { AuthCenterHeader } from "../../components/AuthCenterHeader";
import { useActionCreateController } from "./controller/useActionCreateController";

export function ActionCreateV1() {
  const { t } = usePreferences();
  const { error, isSubmitting, slugify, submit } = useActionCreateController();

  const [name, setName] = useState("");
  const [codeOverride, setCodeOverride] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const code = codeOverride ?? slugify(name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submit({ name, code });
  };

  return (
    <div className="space-y-6">
      <AuthCenterHeader
        description={t("authz.actionCreate.description")}
        title={t("authz.actionCreate.title")}
      />

      <div className="mx-auto max-w-xl">
        <form
          className="overflow-hidden rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_3px_var(--dashboard-shadow)]"
          onSubmit={handleSubmit}
        >
          {/* Header form */}
          <div className="flex items-center gap-3 border-b border-[var(--dashboard-border-soft)] px-6 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-subtle)]">
              <AppIcon className="h-5 w-5" name="calculator" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--dashboard-text)]">
                {t("authz.actionCreate.formTitle")}
              </h2>
              <p className="text-xs text-[var(--dashboard-muted)]">
                {t("authz.form.required")}
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5 px-6 py-6">
            {/* Action Name */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                Action Name <span className="text-red-500">*</span>
              </span>
              <input
                autoFocus
                className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                onChange={(e) => setName(e.target.value)}
                placeholder="Read Data"
                ref={nameRef}
                required
                type="text"
                value={name}
              />
            </label>

            {/* Action Code */}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[var(--dashboard-muted-strong)]">
                Action Code <span className="text-red-500">*</span>
              </span>
              <div className="relative">
                <input
                  className="h-11 w-full rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-3.5 pr-24 font-mono text-sm text-[var(--dashboard-text)] outline-none placeholder:text-[var(--dashboard-subtle)] focus:border-[var(--dashboard-accent-border)] focus:ring-2 focus:ring-[var(--dashboard-accent-soft)]"
                  onChange={(e) => setCodeOverride(slugify(e.target.value))}
                  placeholder="read"
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
              <p className="mt-1.5 text-xs text-[var(--dashboard-subtle)]">
                Unique, lowercase, kebab-safe.
              </p>
            </label>

            {/* Hidden fields — uncomment when needed */}
            {/* <Field label="Action Type" name="type" options={["read","write","approval","export","admin","system"]} required type="select" /> */}
            {/* <Field label="Risk Level" name="riskLevel" options={["low","medium","high","critical"]} required type="select" /> */}
            {/* <Field label="Is System Action" name="isSystem" options={["false","true"]} type="select" /> */}
            {/* <Field label="Description" name="description" placeholder="What this action allows" type="textarea" /> */}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[var(--dashboard-border-soft)] px-6 py-4">
            <a
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] px-5 text-sm font-semibold text-[var(--dashboard-muted-strong)] transition hover:bg-[var(--dashboard-panel-subtle)]"
              href={routes.actions}
            >
              {t("authz.form.cancel")}
            </a>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-hero-border bg-hero px-5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting || !name || !code}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                t("authz.form.save")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
