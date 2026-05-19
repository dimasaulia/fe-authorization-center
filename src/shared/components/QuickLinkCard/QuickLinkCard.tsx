import { AppIcon, type AppIconName } from "@/shared/components/AppIcon";

type QuickLinkCardProps = {
  badge: string;
  description: string;
  icon: AppIconName;
  title: string;
  tone?: "blue" | "green" | "purple";
};

const tones = {
  blue: {
    accent:
      "bg-[var(--dashboard-accent)] text-white shadow-[0_10px_20px_var(--dashboard-accent-shadow)]",
    card: "border-[var(--dashboard-border-soft)] bg-[color-mix(in_srgb,var(--dashboard-panel)_92%,var(--dashboard-accent)_8%)]",
    dot: "bg-[#BBD3E8]",
    line: "bg-[#DDEAF6]",
    primary: "bg-[var(--dashboard-accent)]",
    tag: "border-[var(--dashboard-accent-soft-border)] bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]",
  },
  green: {
    accent: "bg-[#0EA58A] text-white shadow-[0_10px_20px_#0EA58A33]",
    card: "border-[var(--dashboard-border-soft)] bg-[color-mix(in_srgb,var(--dashboard-panel)_92%,#0EA58A_8%)]",
    dot: "bg-[#A9D8CF]",
    line: "bg-[#D8F0EB]",
    primary: "bg-[#0EA58A]",
    tag: "border-[color-mix(in_srgb,var(--dashboard-border-soft)_70%,#0EA58A_30%)] bg-[color-mix(in_srgb,var(--dashboard-panel)_86%,#0EA58A_14%)] text-[#0EA58A]",
  },
  purple: {
    accent: "bg-[#7C3AED] text-white shadow-[0_10px_20px_#7C3AED33]",
    card: "border-[var(--dashboard-border-soft)] bg-[color-mix(in_srgb,var(--dashboard-panel)_92%,#7C3AED_8%)]",
    dot: "bg-[#D7BDFB]",
    line: "bg-[#EEE4FF]",
    primary: "bg-[#7C3AED]",
    tag: "border-[color-mix(in_srgb,var(--dashboard-border-soft)_70%,#7C3AED_30%)] bg-[color-mix(in_srgb,var(--dashboard-panel)_86%,#7C3AED_14%)] text-[#9B6DFF]",
  },
};

export function QuickLinkCard({
  badge,
  description,
  icon,
  title,
  tone = "blue",
}: QuickLinkCardProps) {
  const palette = tones[tone];

  return (
    <article className="flex min-h-[210px] min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_2px_var(--dashboard-shadow)]">
      <div className="relative flex h-[104px] shrink-0 items-center justify-center border-b border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel-subtle)]">
        <div
          className={`flex h-[68px] w-[92px] flex-col gap-2 rounded-[14px] border-[1.5px] px-3 py-2.5 shadow-[0_12px_24px_var(--dashboard-accent-shadow)] ${palette.card}`}
        >
          <div className="flex gap-[5px]">
            <span className={`h-1.5 w-1.5 rounded-full ${palette.dot}`} />
            <span className={`h-1.5 w-1.5 rounded-full ${palette.dot}`} />
            <span className={`h-1.5 w-1.5 rounded-full ${palette.dot}`} />
          </div>
          <span className={`h-[7px] w-9 rounded-full ${palette.primary}`} />
          <span className={`h-1.5 w-[58px] rounded-full ${palette.line}`} />
          <span className={`h-1.5 w-11 rounded-full ${palette.line}`} />
        </div>
        <div
          className={`absolute bottom-[22px] right-[calc(50%-62px)] flex h-[34px] w-[34px] items-center justify-center rounded-[10px] ${palette.accent}`}
        >
          <AppIcon className="h-[17px] w-[17px]" name={icon} />
        </div>
      </div>

      <div className="flex h-[106px] shrink-0 flex-col justify-center gap-2 px-5 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold leading-[1.2] text-[var(--dashboard-text)]">
            {title}
          </h3>
          <span
            className={`shrink-0 rounded-full border px-2 py-1 text-xs leading-4 ${palette.tag}`}
          >
            {badge}
          </span>
        </div>
        <p className="max-w-[350px] text-[13px] leading-[1.35] text-[var(--dashboard-muted)]">
          {description}
        </p>
      </div>
    </article>
  );
}
