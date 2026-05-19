import Link from "next/link";
import { getAuthorizedMenu } from "@/modules/opensuite-sdk/authorization";
import { AppIcon, type AppIconName } from "@/shared/components/AppIcon";

import { DashboardTopbar } from "./components/DashboardTopbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const menu = getAuthorizedMenu();
  const getMenuIcon = (href: string): AppIconName => {
    if (href.includes("users")) return "people";
    if (href.includes("apps")) return "shield";
    if (href.includes("teams")) return "briefcase";
    if (href.includes("actions")) return "calculator";

    return "mail";
  };

  return (
    <main className="h-dvh bg-[var(--dashboard-bg)] text-[var(--dashboard-text)]">
      <div className="flex h-full overflow-hidden">
        <aside className="hidden h-full w-16 shrink-0 flex-col items-center gap-2.5 overflow-y-auto border-r border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-2.5 py-[18px] lg:flex">
          <Link
            aria-label="Open Suite dashboard"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-panel)] text-[var(--dashboard-text)]"
            href="/dashboard"
          >
            <AppIcon className="h-[18px] w-[18px]" name="box" />
          </Link>
          <div className="my-2 h-px w-[30px] bg-[var(--dashboard-border-soft)]" />
          <nav className="flex flex-col gap-2">
            {menu.map((item) => (
              <Link
                aria-label={item.label}
                className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)] first:border first:border-[var(--dashboard-accent-soft-border)] first:bg-[var(--dashboard-accent-soft)] first:text-[var(--dashboard-accent)]"
                href={item.href}
                key={item.href}
              >
                <AppIcon
                  className="h-[18px] w-[18px]"
                  name={getMenuIcon(item.href)}
                />
              </Link>
            ))}
          </nav>
          <div className="flex-1" />
          <Link
            aria-label="Settings"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)]"
            href="/dashboard"
          >
            <AppIcon className="h-5 w-5" name="settings" />
          </Link>
          <Link
            aria-label="Account"
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[var(--dashboard-border-soft)] bg-[var(--dashboard-field)] text-[var(--dashboard-text)]"
            href="/users"
          >
            <AppIcon className="h-[17px] w-[17px]" name="user" />
          </Link>
          <Link
            aria-label="Logout"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[var(--dashboard-text)] transition hover:bg-[var(--dashboard-panel-subtle)]"
            href="/login"
          >
            <AppIcon className="h-[18px] w-[18px]" name="logout" />
          </Link>
        </aside>
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <DashboardTopbar />
          <div className="min-h-0 flex-1 overflow-auto px-5 py-6 md:px-[34px] md:py-[34px]">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
