import { AppIcon, type AppIconName } from "@/shared/components/AppIcon";

type IconBadgeProps = {
  icon: AppIconName;
  tone?: "blue" | "green" | "purple" | "orange" | "pink" | "neutral";
};

const tones = {
  blue: "bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]",
  green: "bg-[#ECFDF5] text-[#047857]",
  neutral: "bg-[var(--dashboard-panel-subtle)] text-[var(--dashboard-text)]",
  orange: "bg-[#FFF7ED] text-[#C2410C]",
  pink: "bg-[#FDF2F8] text-[#BE185D]",
  purple: "bg-[#F5F3FF] text-[#7C3AED]",
};

export function IconBadge({ icon, tone = "blue" }: IconBadgeProps) {
  return (
    <span
      className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[11px] ${tones[tone]}`}
    >
      <AppIcon className="h-[18px] w-[18px]" name={icon} />
    </span>
  );
}
