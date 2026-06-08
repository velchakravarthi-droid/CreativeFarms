import { AppShell } from "@/components/app-shell";
import { Card, Pill } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  await requireUser();
  const data = await loadFarmData();
  const totalAcres = data.totalAcres || data.blocks.reduce((total, block) => total + block.acres, 0);
  const lowStockCount = data.stock.filter((item) => ["low", "reorder"].includes(item.status.toLowerCase())).length;

  return (
    <AppShell
      farmName={data.farmName}
      subtitle="Production foundation connected to Supabase/PostgreSQL masters."
      status={data.source === "supabase" ? "Supabase connected" : "Sample fallback"}
      statusTone={data.source === "supabase" ? "good" : "warn"}
    >
      <div className="content">
        {data.errors?.length ? (
          <section className="notice">
            <strong>Supabase read warning</strong>
            <span>{data.errors.join(" | ")}</span>
          </section>
        ) : null}

        <section className="module-section">
          <div className="module-title">
            <h2>Dashboard</h2>
          </div>
          <div className="kpi-grid">
            <Card title="Farm Structure" action={<Pill tone="good">{data.blocks.length} blocks</Pill>}>
              <strong className="metric">{totalAcres || 125} acres</strong>
              <p>Blocks, rows, properties, and tree assignments are maintained from Farm Structure.</p>
            </Card>
            <Card title="Workers" action={<Pill>{data.workers.length} users</Pill>}>
              <strong className="metric">3 roles</strong>
              <p>Admin, Manager, and User are the current access masters.</p>
            </Card>
            <Card title="Stock" action={<Pill tone={lowStockCount ? "warn" : "good"}>{lowStockCount} low</Pill>}>
              <strong className="metric">{data.stock.length} items</strong>
              <p>Fertilizer, pesticide, fuel, and spares are tracked as inventory items.</p>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
