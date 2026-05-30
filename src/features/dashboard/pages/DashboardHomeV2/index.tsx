"use client";

import { BusinessToolsSection } from "./sections/BusinessToolsSection";
import { useDashboardHomeController } from "./controller/useDashboardHomeController";
import { DashboardGreetingSection } from "./sections/DashboardGreetingSection";
import { DashboardWidgetsSection } from "./sections/DashboardWidgetsSection";
import { QuickLinksSection } from "./sections/QuickLinksSection";

export function DashboardHomeV2() {
  const {
    accessSummary,
    greeting,
    isProfileLoading,
    profileError,
  } = useDashboardHomeController();

  return (
    <div className="flex w-full flex-col gap-6">
      <DashboardGreetingSection
        dateTime={greeting.dateTime}
        greeting={greeting.text}
        isLoading={isProfileLoading}
      />
      <QuickLinksSection />
      <DashboardWidgetsSection
        accessSummary={accessSummary}
        error={profileError}
        isLoading={isProfileLoading}
      />
      <BusinessToolsSection />
    </div>
  );
}
