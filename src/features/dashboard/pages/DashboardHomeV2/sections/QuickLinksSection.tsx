import { usePreferences } from "@/modules/preferences";
import { QuickLinkCard } from "@/shared/components/QuickLinkCard";

import { quickLinks } from "../constants/dashboard-home.constant";

export function QuickLinksSection() {
  const { t } = usePreferences();

  return (
    <section className="grid gap-[18px] xl:grid-cols-3">
      {quickLinks.map((link) => (
        <QuickLinkCard
          badge={t(link.badgeKey)}
          description={t(link.descriptionKey)}
          icon={link.icon}
          key={link.titleKey}
          title={t(link.titleKey)}
          tone={link.tone}
        />
      ))}
    </section>
  );
}
