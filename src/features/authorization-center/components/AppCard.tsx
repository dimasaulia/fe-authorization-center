import Link from "next/link";

import { routes } from "@/config/routes.config";
import { AppIcon } from "@/shared/components/AppIcon";

import type { AuthorizationApp } from "../data/authorization-center.data";
import { StatusBadge } from "./StatusBadge";

type AppCardProps = {
  app?: AuthorizationApp;
  variant?: "app" | "create";
};

export function AppCard({ app, variant = "app" }: AppCardProps) {
  if (variant === "create") {
    return (
      <Link
        className="flex min-h-[170px] flex-col justify-between rounded-2xl border border-dashed border-[var(--dashboard-accent-border)] bg-[var(--dashboard-accent-soft)] p-5 text-[var(--dashboard-accent)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_var(--dashboard-shadow)]"
        href={routes.appCreate}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--dashboard-panel)]">
          <AppIcon className="h-5 w-5" name="shield" />
        </span>
        <span>
          <strong className="block text-base font-semibold">Add app</strong>
          <span className="mt-1 block text-sm leading-5 text-[var(--dashboard-muted-strong)]">
            Register a new app for authorization, credentials, and roles.
          </span>
        </span>
      </Link>
    );
  }

  if (!app) return null;

  return (
    <Link
      className="flex min-h-[170px] flex-col justify-between rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--dashboard-accent-border)] hover:shadow-[0_12px_28px_var(--dashboard-shadow)]"
      href={routes.appDetail(app.id)}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-accent)]">
          <AppIcon className="h-5 w-5" name="shield" />
        </span>
        <StatusBadge status={app.status} />
      </span>
      <span>
        <strong className="block text-base font-semibold text-[var(--dashboard-text)]">
          {app.name}
        </strong>
        <span className="mt-1 block text-sm text-[var(--dashboard-muted)]">
          {app.code} · {app.type}
        </span>
      </span>
    </Link>
  );
}
