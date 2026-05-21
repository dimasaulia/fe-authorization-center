"use client";

import Link from "next/link";

import { routes } from "@/config/routes.config";
import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

import type { AuthorizationApp } from "../data/authorization-center.data";
import { StatusBadge } from "./StatusBadge";

type AppCardProps = {
  app?: AuthorizationApp;
  variant?: "app" | "create";
};

export function AppCard({ app, variant = "app" }: AppCardProps) {
  const { t } = usePreferences();

  if (variant === "create") {
    return (
      <Link
        className="flex min-h-[210px] flex-col items-center justify-center gap-4 rounded-[18px] border border-dashed border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_2px_var(--dashboard-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--dashboard-accent-border)] hover:shadow-[0_12px_28px_var(--dashboard-shadow)]"
        href={routes.appCreate}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-muted)]">
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="text-center">
          <strong className="block text-base font-semibold text-[var(--dashboard-text)]">
            {t("authz.apps.addCard.title")}
          </strong>
          <span className="mt-1 block max-w-[160px] text-[13px] leading-[1.35] text-[var(--dashboard-muted)]">
            {t("authz.apps.addCard.description")}
          </span>
        </span>
      </Link>
    );
  }

  if (!app) return null;

  return (
    <Link
      className="flex min-h-[210px] flex-col overflow-hidden rounded-[18px] border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_2px_var(--dashboard-shadow)] transition hover:-translate-y-0.5 hover:border-[var(--dashboard-accent-border)] hover:shadow-[0_12px_28px_var(--dashboard-shadow)]"
      href={routes.appDetail(app.id)}
    >
      <div className="flex h-[104px] shrink-0 items-center justify-center border-b border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel-subtle)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] text-[var(--dashboard-subtle)]">
          <AppIcon className="h-6 w-6" name="shield" />
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <strong className="text-base font-semibold leading-[1.2] text-[var(--dashboard-text)]">
            {app.name}
          </strong>
          <StatusBadge status={app.status} />
        </div>
        <p className="text-[13px] leading-[1.35] text-[var(--dashboard-muted)]">
          {app.code} · {app.type}
        </p>
      </div>
    </Link>
  );
}
