import { useMemo, useState } from "react";

import { usePreferences } from "@/modules/preferences";
import { BusinessToolCard } from "@/shared/components/BusinessToolCard";

import {
  businessTools,
  toolCategories,
  type ToolCategory,
} from "../constants/dashboard-home.constant";

export function BusinessToolsSection() {
  const { t } = usePreferences();
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("forYou");

  const filteredTools = useMemo(
    () =>
      businessTools.filter((tool) =>
        (tool.categories as ReadonlyArray<ToolCategory>).includes(
          activeCategory,
        ),
      ),
    [activeCategory],
  );

  return (
    <section className="overflow-hidden rounded-[20px] border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] shadow-[0_1px_2px_var(--dashboard-shadow)]">
      <div className="flex flex-col gap-3.5 border-b border-[var(--dashboard-border-soft)] px-5 py-[18px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold leading-[1.2] text-[var(--dashboard-text)]">
              {t("dashboard.tools.title")}
            </h2>
            <p className="mt-1 text-[13px] leading-[1.4] text-[var(--dashboard-muted)]">
              {t("dashboard.tools.description")}
            </p>
          </div>
          <button
            className="w-fit text-[13px] leading-4 text-[var(--dashboard-muted)] transition hover:text-[var(--dashboard-accent)]"
            type="button"
          >
            {t("dashboard.tools.open")}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {toolCategories.map((category) => (
            <button
              aria-pressed={activeCategory === category.key}
              className={[
                "h-[34px] rounded-[11px] border px-3.5 text-[13px] font-medium leading-4 transition",
                activeCategory === category.key
                  ? "border-[var(--dashboard-accent-border)] bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]"
                  : "border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] text-[var(--dashboard-muted-strong)] hover:border-[var(--dashboard-accent-border)] hover:text-[var(--dashboard-accent)]",
              ].join(" ")}
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              type="button"
            >
              {t(category.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {filteredTools.map((tool) => (
          <BusinessToolCard
            description={t(tool.descriptionKey)}
            icon={tool.icon}
            key={tool.titleKey}
            title={t(tool.titleKey)}
            tone={tool.tone}
          />
        ))}
      </div>
    </section>
  );
}
