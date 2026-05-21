"use client";

import Link from "next/link";

import { usePreferences } from "@/modules/preferences";
import { AppIcon } from "@/shared/components/AppIcon";

type AuthCenterHeaderProps = {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  eyebrow?: string;
  title: string;
};

export function AuthCenterHeader({
  actionHref,
  actionLabel,
  description,
  eyebrow,
  title,
}: AuthCenterHeaderProps) {
  const { t } = usePreferences();

  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--dashboard-accent-soft-border)] bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]">
          <AppIcon className="h-6 w-6" name="shield" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--dashboard-accent)]">
            {eyebrow ?? t("authz.eyebrow")}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-[var(--dashboard-text)]">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--dashboard-muted)]">
            {description}
          </p>
        </div>
      </div>
      {actionHref && actionLabel ? (
        <Link
          className="inline-flex h-11 items-center justify-center rounded-xl border border-hero-border bg-hero px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(1,109,252,0.22)] transition hover:bg-hero-hover"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
