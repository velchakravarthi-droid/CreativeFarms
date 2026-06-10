import { AppShell } from "@/components/app-shell";
import { StockBalanceTable } from "@/components/stock-balance-table";
import { Card, Pill } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import { loadStockData, type StockItem } from "@/lib/load-stock-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  await requireUser();
  const data = await loadFarmData();
  const stockData = await loadStockData();
  const totalAcres = data.totalAcres || data.blocks.reduce((total, block) => total + block.acres, 0);
  const lowStockCount = stockData.items.filter((item) => {
    const balance = stockData.balances.find((stockBalance) => stockBalance.itemId === item.itemId);
    return item.minimumStockQuantity > 0 && Number(balance?.currentBaseQuantity ?? 0) <= minimumBase(item);
  }).length;

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
              <strong className="metric">{stockData.items.length || data.stock.length} items</strong>
              <p>Current stock balance is monitored on the dashboard. Stock maintenance is handled from the Stock menu.</p>
            </Card>
          </div>
        </section>

        <section className="module-section">
          <div className="module-title">
            <h2>Stock Balance</h2>
          </div>
          <StockBalanceTable balances={stockData.balances} items={stockData.items} />
        </section>
      </div>
    </AppShell>
  );
}

function minimumBase(item: StockItem) {
  if (!item.minimumStockQuantity) return 0;
  if (item.hasPackage && item.minimumStockUnit === item.packageName) {
    return item.minimumStockQuantity * item.packageQuantity;
  }
  return item.minimumStockQuantity;
}
