import { AppShell } from "@/components/app-shell";
import { Card, Field, Pill } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";

export const dynamic = "force-dynamic";

export default async function FarmStructurePage() {
  await requireUser();
  const data = await loadFarmData();
  const selectedBlock = data.blocks[0];
  const blockNames = ["All Blocks", ...data.blocks.map((block) => block.name)];
  const rowNames = ["All Rows", ...(selectedBlock?.rows.map((row) => row.name) ?? [])];
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

        <section id="land-structure" className="module-section">
          <div className="module-title">
            <h2>Land Structure</h2>
          </div>
          <div className="land-builder">
            <Card title="Master Farm Blocks" action={<Pill>{data.blocks.length} blocks</Pill>}>
              <div className="master-farm-band">
                <strong>{data.farmName}</strong>
                <span>{totalAcres || 125} acres</span>
              </div>
              <div className="land-block-list">
                {data.blocks.map((block, index) => (
                  <article className={`land-block-card ${index === 0 ? "selected" : ""}`} key={block.id}>
                    <div>
                      <strong>{block.name}</strong>
                      <span>{block.notes || "Farm operating area"}</span>
                    </div>
                    <div className="land-block-meta">
                      <span>{block.acres} acres</span>
                      <span>{block.rowCount} rows</span>
                    </div>
                  </article>
                ))}
              </div>
            </Card>

            <Card title="Block Details" action={<Pill tone="warn">Setup</Pill>}>
              <div className="entry-grid">
                <Field label="Block Name" placeholder={selectedBlock?.name ?? "Block name"} />
                <Field label="Acres" type="number" placeholder={String(selectedBlock?.acres ?? "")} />
                <Field label="Status" options={["Active", "Inactive"]} />
                <Field label="Notes" placeholder={selectedBlock?.notes ?? "Short purpose or location"} />
              </div>
              <button className="button">Save Block</button>
            </Card>
          </div>

          <Card title={`Rows in ${selectedBlock?.name ?? "Selected Block"}`} action={<Pill>{selectedBlock?.rowCount ?? 0} rows</Pill>}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Block</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedBlock?.rows ?? []).slice(0, 8).map((row) => (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{selectedBlock?.name}</td>
                      <td>
                        <Pill tone="good">{row.status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

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
