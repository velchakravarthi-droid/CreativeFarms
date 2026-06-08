import { AppShell } from "@/components/app-shell";
import { TreeAssignmentMaintenance } from "@/components/tree-assignment-maintenance";
import { Card, Pill } from "@/components/ui";
import { getCurrentWorkerRole, requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TreeAssignmentsPage() {
  await requireUser();
  const role = await getCurrentWorkerRole();
  const data = await loadFarmData();
  const treeCount = data.treeAssignments.reduce((total, assignment) => total + assignment.count, 0);

  return (
    <AppShell
      farmName={data.farmName}
      subtitle="Assign tree masters to farm blocks and child rows."
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
            <h2>Tree Type Assignment</h2>
          </div>
          <div className="subnav">
            <Link href="/farm-structure">Land Structure</Link>
            <Link href="/farm-structure/properties">Farm Property Master</Link>
            <Link href="/farm-structure/tree-assignments">Tree Type Assignment</Link>
          </div>
          <div className="kpi-grid">
            <Card title="Assignments" action={<Pill>{data.treeAssignments.length} records</Pill>}>
              <strong className="metric">{treeCount.toLocaleString()}</strong>
              <p>Tree count is maintained by block and row assignment.</p>
            </Card>
            <Card title="Farm Blocks" action={<Pill tone="good">Master</Pill>}>
              <strong className="metric">{data.blocks.length}</strong>
              <p>Block and row choices come directly from Land Structure.</p>
            </Card>
            <Card title="Admin Control" action={<Pill tone={role === "admin" ? "good" : "warn"}>{role ?? "none"}</Pill>}>
              <strong className="metric">{role === "admin" ? "On" : "Off"}</strong>
              <p>Only Admin can add, modify, or delete tree assignments.</p>
            </Card>
          </div>
        </section>

        <TreeAssignmentMaintenance assignments={data.treeAssignments} blocks={data.blocks} isAdmin={role === "admin"} properties={data.properties} />
      </div>
    </AppShell>
  );
}
