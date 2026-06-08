import { AppShell } from "@/components/app-shell";
import { IrrigationEntry } from "@/components/irrigation-entry";
import { Card, Pill } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type IrrigationRow = {
  id: string;
  block_id: string | null;
  row_id: string | null;
  activity_date: string;
  worker_profiles?: { full_name: string } | { full_name: string }[] | null;
  farm_blocks?: { name: string } | { name: string }[] | null;
  farm_rows?: { name: string } | { name: string }[] | null;
};

export default async function IrrigationPage() {
  await requireUser();
  const data = await loadFarmData();
  const supabase = createAdminClient();
  const workers = await loadWorkers();
  const history = await loadIrrigationHistory();

  return (
    <AppShell
      farmName={data.farmName}
      subtitle="Record irrigation by block and row, and review the latest irrigation date."
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
            <span>Irrigation entries need Supabase environment variables and real farm master data.</span>
          </section>
        ) : null}

        <section className="module-section">
          <div className="module-title">
            <h2>Irrigation</h2>
          </div>
          <div className="kpi-grid">
            <Card title="Blocks" action={<Pill>{data.blocks.length} masters</Pill>}>
              <strong className="metric">{data.blocks.length}</strong>
              <p>Rows are refreshed based on the selected block.</p>
            </Card>
            <Card title="Workers" action={<Pill>{workers.length} active</Pill>}>
              <strong className="metric">{workers.length}</strong>
              <p>Worker values come from the Admin worker master.</p>
            </Card>
            <Card title="Irrigation History" action={<Pill tone={history.length ? "good" : "warn"}>{history.length} entries</Pill>}>
              <strong className="metric">{history[0]?.activityDate ?? "-"}</strong>
              <p>Latest irrigation entry in the farm activity log.</p>
            </Card>
          </div>
        </section>

        <IrrigationEntry blocks={data.blocks} history={history} workers={workers} />
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

async function loadIrrigationHistory() {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("activity_entries")
    .select("id, block_id, row_id, activity_date, worker_profiles(full_name), farm_blocks(name), farm_rows(name)")
    .eq("activity_type", "Irrigation")
    .order("activity_date", { ascending: false })
    .limit(100);

  return ((data ?? []) as IrrigationRow[]).map((entry) => {
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
      activityDate: entry.activity_date
    };
  });
}

function firstRelated<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
