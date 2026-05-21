"use client";

import { usePreferences } from "@/modules/preferences";
import { Button } from "@/shared/components/Button";

type FormShellProps = {
  cancelHref: string;
  children: React.ReactNode;
  title: string;
};

export function FormShell({ cancelHref, children, title }: FormShellProps) {
  const { t } = usePreferences();

  return (
    <form className="rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-5">
      <h2 className="text-lg font-semibold text-[var(--dashboard-text)]">
        {title}
      </h2>
      <p className="mt-1 text-sm text-[var(--dashboard-muted)]">
        {t("authz.form.required")}
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button href={cancelHref} variant="secondary">
          {t("authz.form.cancel")}
        </Button>
        <Button type="submit">{t("authz.form.save")}</Button>
      </div>
    </form>
  );
}
