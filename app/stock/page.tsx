import { AppShell } from "@/components/app-shell";
import { StockModule } from "@/components/stock-module";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import { loadStockData } from "@/lib/load-stock-data";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  await requireUser();
  const farmData = await loadFarmData();
  const stockData = await loadStockData();

  return (
    <AppShell
      farmName={farmData.farmName}
      subtitle="Maintain stock masters, purchases, usage, and history."
      status={farmData.source === "supabase" ? "Supabase connected" : "Sample fallback"}
      statusTone={farmData.source === "supabase" ? "good" : "warn"}
    >
      <StockModule
        balances={stockData.balances}
        categories={stockData.categories}
        items={stockData.items}
        transactions={stockData.transactions}
        types={stockData.types}
        workers={farmData.workers}
        zones={farmData.blocks.map((block) => block.name)}
      />
    </AppShell>
  );
}
