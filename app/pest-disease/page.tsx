import { AppShell } from "@/components/app-shell";
import { PestDiseaseEntry } from "@/components/pest-disease-entry";
import { Card, Pill } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type TreeIssueRow = {
  id: string;
  observed_on: string;
  tree_type: string | null;
  issue_type: string;
  issue_category: string | null;
  issue_status: string | null;
  notes: string | null;
  farm_blocks?: { name: string } | { name: string }[] | null;
  farm_rows?: { name: string } | { name: string }[] | null;
};

export default async function PestDiseasePage() {
  await requireUser();
  const data = await loadFarmData();
  const supabase = createAdminClient();
  const issues = await loadTreeIssues();
  const openIssues = issues.filter((issue) => ["Open", "Treatment In Progress"].includes(issue.issueStatus)).length;

  return (
    <AppShell
      farmName={data.farmName}
      subtitle="Record pest, disease, growth, and tree issues in one place."
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
            <span>Pest / Disease issues need Supabase environment variables and real farm master data.</span>
          </section>
        ) : null}

        <section className="module-section">
          <div className="module-title">
            <h2>Pest / Disease</h2>
          </div>
          <div className="kpi-grid">
            <Card title="Open Issues" action={<Pill tone={openIssues ? "warn" : "good"}>{openIssues} active</Pill>}>
              <strong className="metric">{openIssues}</strong>
              <p>Pest, disease, growth, and tree issues share one screen.</p>
            </Card>
            <Card title="Tree Types" action={<Pill>Property Master</Pill>}>
              <strong className="metric">{data.properties.filter((property) => property.type.trim().toLowerCase() === "tree").length}</strong>
              <p>Tree type values come from Farm Property Master records with type Tree.</p>
            </Card>
            <Card title="History" action={<Pill>{issues.length} records</Pill>}>
              <strong className="metric">{issues[0]?.observedOn ?? "-"}</strong>
              <p>Latest issue recorded in the farm issue log.</p>
            </Card>
          </div>
        </section>

        <PestDiseaseEntry blocks={data.blocks} issues={issues} properties={data.properties} />
      </div>
    </AppShell>
  );
}

async function loadTreeIssues() {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("tree_exceptions")
    .select("id, observed_on, tree_type, issue_type, issue_category, issue_status, notes, farm_blocks(name), farm_rows(name)")
    .order("observed_on", { ascending: false })
    .limit(100);

  return ((data ?? []) as TreeIssueRow[]).map((issue) => {
    const block = firstRelated(issue.farm_blocks);
    const row = firstRelated(issue.farm_rows);

    return {
      id: issue.id,
      observedOn: issue.observed_on,
      blockName: block?.name ?? "Block",
      rowName: row?.name ?? "Row",
      treeType: issue.tree_type ?? "-",
      issueCategory: issue.issue_category ?? "pest",
      issueStatus: issue.issue_status ?? "Open",
      comments: issue.notes ?? issue.issue_type
    };
  });
}

function firstRelated<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
