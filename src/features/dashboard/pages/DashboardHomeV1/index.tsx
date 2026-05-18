import { Can } from "@/modules/auth/components/Can";
import { MetricCard } from "@/shared/components/MetricCard";
import { DashboardActionSection } from "./sections/DashboardActionSection";

export function DashboardHomeV1() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-accent">DashboardHomeV1</p>
        <h2 className="mt-2 text-3xl font-semibold">Architecture health</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Example dashboard route mapped by App Router, rendered from a
          versioned feature page, and filtered by a demo access snapshot.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          description="Route groups, dashboard shell, and auth shell are active."
          label="Routes"
          value="3"
        />
        <MetricCard
          description="Auth, dashboard, and user-management are split by feature."
          label="Features"
          value="3"
        />
        <MetricCard
          description="Access checks are consumed through module boundaries."
          label="Permissions"
          value="SDK-ready"
        />
      </div>
      <Can permission="user.create">
        <DashboardActionSection />
      </Can>
    </div>
  );
}
