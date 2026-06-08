import { AppShell } from "@/components/app-shell";
import { FarmPropertyMaintenance } from "@/components/farm-property-maintenance";
import { Card, Pill } from "@/components/ui";
import { getCurrentWorkerRole, requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FarmPropertiesPage() {
  await requireUser();
  const role = await getCurrentWorkerRole();
  const data = await loadFarmData();
  const activeProperties = data.properties.filter((property) => property.status === "active").length;

  return (
    <AppShell
      farmName={data.farmName}
      subtitle="Maintain reusable farm property masters."
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
            <h2>Farm Property Master</h2>
          </div>
          <div className="subnav">
            <Link href="/farm-structure">Land Structure</Link>
            <Link href="/farm-structure/properties">Farm Property Master</Link>
            <Link href="/farm-structure/tree-assignments">Tree Type Assignment</Link>
          </div>
          <div className="kpi-grid">
            <Card title="Properties" action={<Pill>{data.properties.length} masters</Pill>}>
              <strong className="metric">{activeProperties}</strong>
              <p>Active farm properties are reused by equipment, trees, and assignments.</p>
            </Card>
            <Card title="Tree Masters" action={<Pill tone="good">Tree</Pill>}>
              <strong className="metric">{data.properties.filter((property) => property.type.toLowerCase() === "tree").length}</strong>
              <p>Tree masters feed the tree type assignment screen.</p>
            </Card>
            <Card title="Admin Control" action={<Pill tone={role === "admin" ? "good" : "warn"}>{role ?? "none"}</Pill>}>
              <strong className="metric">{role === "admin" ? "On" : "Off"}</strong>
              <p>Only Admin can add, modify, or delete property masters.</p>
            </Card>
          </div>
        </section>

        <FarmPropertyMaintenance isAdmin={role === "admin"} properties={data.properties} />
      </div>
    </AppShell>
  );
}
