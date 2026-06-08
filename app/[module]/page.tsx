import { AppShell } from "@/components/app-shell";
import { Card, Field, Pill } from "@/components/ui";
import { navItems } from "@/lib/farm-data";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  await requireUser();
  const { module } = await params;
  const path = `/${module}`;
  const navItem = navItems.find((item) => item.href === path);

  if (!navItem) {
    notFound();
  }

  const data = await loadFarmData();
  const blockNames = data.blocks.map((block) => block.name);
  const workerNames = data.workers.map((worker) => worker.name);
  const stockNames = data.stock.map((item) => item.name);

  return (
    <AppShell
      farmName={data.farmName}
      subtitle={`${navItem.label} is now available as a separate screen.`}
      status={data.source === "supabase" ? "Supabase connected" : "Sample fallback"}
      statusTone={data.source === "supabase" ? "good" : "warn"}
    >
      <div className="content">
        <section className="module-section">
          <div className="module-title">
            <h2>{navItem.label}</h2>
          </div>
          <div className="grid-two">
            <Card title={`${navItem.label} Entry`} action={<Pill>Screen</Pill>}>
              <div className="entry-grid">
                <Field label="Date" type="date" />
                <Field label="Block" options={blockNames.length ? blockNames : ["South Block"]} />
                <Field label="Worker" options={workerNames.length ? workerNames : ["Farm Manager"]} />
                <Field label="Reference Item" options={stockNames.length ? stockNames : ["Not applicable"]} />
              </div>
              <button className="button">Save Entry</button>
            </Card>
            <Card title="Master Relationship" action={<Pill tone="good">Connected</Pill>}>
              <p>
                This screen uses farm blocks, rows, workers, stock, and property masters from the shared Supabase setup.
                Detailed forms can now be built per module without keeping everything on one scrolling page.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
