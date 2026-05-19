import { AppIcon, type AppIconName } from "@/shared/components/AppIcon";
import { IconBadge } from "@/shared/components/IconBadge";

type BusinessToolCardProps = {
  description: string;
  icon: AppIconName;
  title: string;
  tone?: "blue" | "green" | "purple" | "orange" | "pink" | "neutral";
};

export function BusinessToolCard({
  description,
  icon,
  title,
  tone = "blue",
}: BusinessToolCardProps) {
  return (
    <button
      className="flex min-h-[104px] min-w-[180px] flex-1 flex-col gap-2.5 rounded-[15px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] px-3.5 py-3.5 text-left transition hover:-translate-y-0.5 hover:border-[var(--dashboard-accent-border)] hover:shadow-[0_12px_28px_var(--dashboard-shadow)]"
      type="button"
    >
      <IconBadge icon={icon} tone={tone} />
      <span className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold leading-[18px] text-[var(--dashboard-text)]">
          {title}
        </span>
        <span className="text-xs leading-[1.35] text-[var(--dashboard-subtle)]">
          {description}
        </span>
      </span>
      <AppIcon className="sr-only" name={icon} />
    </button>
  );
}
