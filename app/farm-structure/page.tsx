import { AppShell } from "@/components/app-shell";
import { Card, Field, Pill } from "@/components/ui";
import { FarmStructureMaintenance } from "@/components/farm-structure-maintenance";
import { getCurrentWorkerRole, requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";

export const dynamic = "force-dynamic";

export default async function FarmStructurePage() {
  await requireUser();
  const role = await getCurrentWorkerRole();
  const data = await loadFarmData();
  const blockNames = ["All Blocks", ...data.blocks.map((block) => block.name)];
  const rowNames = ["All Rows", ...(data.blocks[0]?.rows.map((row) => row.name) ?? [])];
  const treeProperties = data.properties.filter((property) => property.type.toLowerCase() === "tree");
  const propertyNames = treeProperties.length ? treeProperties.map((property) => property.name) : data.properties.map((property) => property.name);
  const totalAcres = data.totalAcres || data.blocks.reduce((total, block) => total + block.acres, 0);
  const activeProperties = data.properties.filter((property) => property.status.toLowerCase() === "active").length;
  const treeCount = data.treeAssignments.reduce((total, assignment) => total + assignment.count, 0);

  return (
    <AppShell
      farmName={data.farmName}
      subtitle="Maintain farm blocks, rows, property masters, and tree type assignments."
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
            <h2>Farm Structure</h2>
          </div>

          <div className="subnav">
            <a href="#land-structure">Land Structure</a>
            <a href="#property-master">Farm Property Master</a>
            <a href="#tree-assignment">Tree Type Assignment</a>
          </div>

          <div className="kpi-grid">
            <Card title="Farm Size" action={<Pill tone="good">Master</Pill>}>
              <strong className="metric">{totalAcres || 125} acres</strong>
              <p>Master farm is divided into blocks and rows.</p>
            </Card>
            <Card title="Primary Unit" action={<Pill>Block / Row</Pill>}>
              <strong className="metric">{data.blocks.length} blocks</strong>
              <p>Every activity should point to the right farm block and row when needed.</p>
            </Card>
            <Card title="Farm Properties" action={<Pill>{activeProperties} active</Pill>}>
              <strong className="metric">{treeCount.toLocaleString()}</strong>
              <p>Tree counts come from tree type assignments.</p>
            </Card>
          </div>
        </section>

        <FarmStructureMaintenance blocks={data.blocks} farmName={data.farmName} isAdmin={role === "admin"} totalAcres={totalAcres} />

        <section id="property-master" className="module-section">
          <div className="module-title">
            <h2>Farm Property Master</h2>
          </div>
          <div className="grid-two">
            <Card title="Farm Properties" action={<Pill>{data.properties.length} masters</Pill>}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.properties.map((property) => (
                      <tr key={property.id}>
                        <td>{property.type}</td>
                        <td>{property.name}</td>
                        <td>{property.quantity || "-"}</td>
                        <td>
                          <Pill tone={property.status.toLowerCase() === "active" ? "good" : "warn"}>{property.status}</Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Add / Edit Property" action={<Pill>Master</Pill>}>
              <div className="entry-grid single">
                <Field label="Property Type" options={["Tree", "Equipment", "Building", "Water Source", "Storage"]} />
                <Field label="Property Name" placeholder="Water Coconut" />
                <Field label="Quantity" type="number" placeholder="Optional" />
                <Field label="Status" options={["Active", "Inactive"]} />
              </div>
              <button className="button">Save Property</button>
            </Card>
          </div>
        </section>

        <section id="tree-assignment" className="module-section">
          <div className="module-title">
            <h2>Tree Type Assignment</h2>
          </div>
          <div className="grid-two">
            <Card title="Assigned Tree Types" action={<Pill>{data.treeAssignments.length} assignments</Pill>}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tree Type</th>
                      <th>Block</th>
                      <th>Row</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.treeAssignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td>{assignment.propertyName}</td>
                        <td>{assignment.block}</td>
                        <td>{assignment.row}</td>
                        <td>{assignment.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Assign Tree Type" action={<Pill>Block / Row</Pill>}>
              <div className="entry-grid single">
                <Field label="Tree Type" options={propertyNames.length ? propertyNames : ["Water Coconut"]} />
                <Field label="Block" options={blockNames} />
                <Field label="Row / Range" options={rowNames} />
                <Field label="Tree Count" type="number" placeholder="0" />
              </div>
              <button className="button">Save Assignment</button>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
