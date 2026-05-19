"use client";

import { BusinessToolsSection } from "./sections/BusinessToolsSection";
import { DashboardGreetingSection } from "./sections/DashboardGreetingSection";
import { DashboardWidgetsSection } from "./sections/DashboardWidgetsSection";
import { QuickLinksSection } from "./sections/QuickLinksSection";

export function DashboardHomeV2() {
  return (
    <div className="flex w-full flex-col gap-6">
      <DashboardGreetingSection />
      <QuickLinksSection />
      <DashboardWidgetsSection />
      <BusinessToolsSection />
    </div>
  );
}
