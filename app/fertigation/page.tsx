import { AppShell } from "@/components/app-shell";
import { FertigationEntry } from "@/components/fertigation-entry";
import { Card, Pill } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type FertigationRow = {
  id: string;
  block_id: string | null;
  row_id: string | null;
  activity_date: string;
  notes: string | null;
  worker_profiles?: { full_name: string } | { full_name: string }[] | null;
  farm_blocks?: { name: string } | { name: string }[] | null;
  farm_rows?: { name: string } | { name: string }[] | null;
};

export default async function FertigationPage() {
  await requireUser();
  const data = await loadFarmData();
  const supabase = createAdminClient();
  const workers = await loadWorkers();
  const history = await loadFertigationHistory();
  const fertilizerCount = data.stock.filter((item) => item.category.toLowerCase().includes("fertilizer")).length;

  return (
    <AppShell
      farmName={data.farmName}
      subtitle="Record fertigation by block and row, and review the latest fertigation date."
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

        {!supabase ? (
          <section className="notice">
            <strong>Supabase required</strong>
            <span>Fertigation entries need Supabase environment variables and real farm master data.</span>
          </section>
        ) : null}

        <section className="module-section">
          <div className="module-title">
            <h2>Fertigation</h2>
          </div>
          <div className="kpi-grid">
            <Card title="Blocks" action={<Pill>{data.blocks.length} masters</Pill>}>
              <strong className="metric">{data.blocks.length}</strong>
              <p>Rows are refreshed based on the selected block.</p>
            </Card>
            <Card title="Fertilizer Stock" action={<Pill tone={fertilizerCount ? "good" : "warn"}>{fertilizerCount} items</Pill>}>
              <strong className="metric">{fertilizerCount}</strong>
              <p>Fertilizer values come from Stock items in the fertilizer category.</p>
            </Card>
            <Card title="Fertigation History" action={<Pill tone={history.length ? "good" : "warn"}>{history.length} entries</Pill>}>
              <strong className="metric">{history[0]?.activityDate ?? "-"}</strong>
              <p>Latest fertigation entry in the farm activity log.</p>
            </Card>
          </div>
        </section>

        <FertigationEntry blocks={data.blocks} history={history} stock={data.stock} workers={workers} />
      </div>
    </AppShell>
  );
}

async function loadWorkers() {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("worker_profiles")
    .select("id, full_name, role")
    .eq("status", "active")
    .order("full_name");

  return (data ?? []).map((worker) => ({
    id: worker.id,
    name: worker.full_name,
    role: worker.role
  }));
}

async function loadFertigationHistory() {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("activity_entries")
    .select("id, block_id, row_id, activity_date, notes, worker_profiles(full_name), farm_blocks(name), farm_rows(name)")
    .eq("activity_type", "Fertigation")
    .order("activity_date", { ascending: false })
    .limit(100);

  return ((data ?? []) as FertigationRow[]).map((entry) => {
    const worker = firstRelated(entry.worker_profiles);
    const block = firstRelated(entry.farm_blocks);
    const row = firstRelated(entry.farm_rows);

    return {
      id: entry.id,
      blockId: entry.block_id ?? "",
      rowId: entry.row_id ?? "",
      blockName: block?.name ?? "Block",
      rowName: row?.name ?? "Row",
      workerName: worker?.full_name ?? "Worker",
      activityDate: entry.activity_date,
      notes: entry.notes ?? ""
    };
  });
}

function firstRelated<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
