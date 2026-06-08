import { logout } from "@/app/actions";
import { navItems } from "@/lib/farm-data";
import Link from "next/link";
import type { ReactNode } from "react";
import { Pill } from "./ui";

export function AppShell({
  children,
  farmName,
  subtitle,
  status = "Sample fallback",
  statusTone = "warn"
}: {
  children: ReactNode;
  farmName: string;
  subtitle: string;
  status?: string;
  statusTone?: "good" | "warn" | "bad" | "info";
}) {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <div className="brand-mark">CF</div>
          <div>
            <strong>{farmName}</strong>
            <span>Farm operations</span>
          </div>
        </Link>
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.href} className="nav-button">
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>Creative Farm Operations</h1>
            <p>{subtitle}</p>
          </div>
          <div className="topbar-actions">
            <Pill tone="warn">Offline-first planned</Pill>
            <Pill tone={statusTone}>{status}</Pill>
            <form action={logout}>
              <button className="button secondary-button">Sign out</button>
            </form>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
