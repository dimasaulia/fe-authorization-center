import Link from "next/link";

import { routes } from "@/config/routes.config";

type AuthCenterNavProps = {
  active: "apps" | "teams" | "actions";
};

const items = [
  { key: "apps", label: "Apps", href: routes.apps },
  { key: "teams", label: "Teams", href: routes.teams },
  { key: "actions", label: "Actions", href: routes.actions },
] as const;

export function AuthCenterNav({ active }: AuthCenterNavProps) {
  return (
    <nav className="flex flex-wrap gap-2 rounded-2xl border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] p-2">
      {items.map((item) => (
        <Link
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            active === item.key
              ? "bg-[var(--dashboard-accent-soft)] text-[var(--dashboard-accent)]"
              : "text-[var(--dashboard-muted)] hover:bg-[var(--dashboard-panel-subtle)] hover:text-[var(--dashboard-text)]"
          }`}
          href={item.href}
          key={item.key}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
