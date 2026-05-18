import { Button } from "@/shared/components/Button";

export function DashboardActionSection() {
  return (
    <section className="rounded-lg border border-line bg-panel p-5">
      <p className="text-sm font-semibold text-warning">Permission rendering</p>
      <h3 className="mt-2 text-xl font-semibold">Create action is visible</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        This block is rendered through the `Can` component using the demo access
        snapshot from the auth module.
      </p>
      <div className="mt-4">
        <Button href="/users">Open user management</Button>
      </div>
    </section>
  );
}
