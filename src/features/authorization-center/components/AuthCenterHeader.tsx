import { AppIcon } from "@/shared/components/AppIcon";
import { Button } from "@/shared/components/Button";

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
  eyebrow = "Authorization Center",
  title,
}: AuthCenterHeaderProps) {
  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--dashboard-accent-soft-border)] bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]">
          <AppIcon className="h-6 w-6" name="shield" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--dashboard-accent)]">
            {eyebrow}
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
        <Button className="h-11" href={actionHref}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  );
}
