import Link from "next/link";
import { appConfig } from "@/config/app.config";
import { getAuthorizedMenu } from "@/modules/opensuite-sdk/authorization";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const menu = getAuthorizedMenu();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-line bg-panel px-5 py-5 lg:border-b-0 lg:border-r">
          <div className="text-lg font-semibold">{appConfig.name}</div>
          <nav className="mt-8 flex gap-2 lg:flex-col">
            {menu.map((item) => (
              <Link
                className="rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-background hover:text-foreground"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>
          <header className="flex items-center justify-between border-b border-line bg-panel px-6 py-4">
            <div>
              <p className="text-sm font-medium text-muted">Workspace</p>
              <h1 className="text-xl font-semibold">OpenSuite Console</h1>
            </div>
            <Link
              className="rounded-md border border-line px-3 py-2 text-sm font-semibold"
              href="/login"
            >
              Login
            </Link>
          </header>
          <div className="px-6 py-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
