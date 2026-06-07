import { costTypes, farmBlocks, navItems, stockItems, workers } from "@/lib/farm-data";
import { logout } from "@/app/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

type FarmBlockRow = {
  id: string;
  name: string;
  acres: number | null;
  status: string;
  farm_rows?: { id: string }[];
};

type WorkerRow = {
  id: string;
  full_name: string;
  role: string;
  access_area: string | null;
  status: string;
};

type InventoryItemRow = {
  id: string;
  name: string;
  category: string;
  item_type: string | null;
  current_stock: number;
  unit: string;
  status: string;
};

function Pill({ children, tone = "info" }: { children: ReactNode; tone?: "good" | "warn" | "bad" | "info" }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function Card({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="card">
      <div className="section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ModuleSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="module-section">
      <div className="module-title">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  options,
  type = "text",
  placeholder
}: {
  label: string;
  options?: string[];
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input type={type} placeholder={placeholder ?? label} />
      )}
    </label>
  );
}

async function loadFarmData() {
  const supabase = createAdminClient();

  if (!supabase) {
    return {
      source: "sample",
      farmName: "Creative Farm",
      blocks: farmBlocks.map((block) => ({ ...block, rowCount: block.rows })),
      workers: workers.map((worker) => ({
        name: worker.name,
        role: worker.role,
        area: worker.area,
        status: "Active"
      })),
      stock: stockItems
    };
  }

  const [farmResult, blocksResult, workersResult, stockResult] = await Promise.all([
    supabase.from("farms").select("id, name, total_acres").order("created_at", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("farm_blocks").select("id, name, acres, status, farm_rows(id)").order("name"),
    supabase.from("worker_profiles").select("id, full_name, role, access_area, status").order("full_name"),
    supabase.from("inventory_items").select("id, name, category, item_type, current_stock, unit, status").order("name")
  ]);

  const blocks = ((blocksResult.data ?? []) as FarmBlockRow[]).map((block) => ({
    name: block.name,
    acres: Number(block.acres ?? 0),
    rowCount: block.farm_rows?.length ?? 0,
    status: block.status
  }));

  const workerRows = ((workersResult.data ?? []) as WorkerRow[]).map((worker) => ({
    name: worker.full_name,
    role: worker.role,
    area: worker.access_area ?? "Assigned work",
    status: worker.status
  }));

  const stockRows = ((stockResult.data ?? []) as InventoryItemRow[]).map((item) => ({
    name: item.name,
    category: item.category,
    type: item.item_type ?? item.category,
    qty: `${item.current_stock ?? 0} ${item.unit}`,
    status: item.status
  }));

  return {
    source: "supabase",
    farmName: farmResult.data?.name ?? "Creative Farm",
    blocks: blocks.length ? blocks : farmBlocks.map((block) => ({ ...block, rowCount: block.rows })),
    workers: workerRows.length
      ? workerRows
      : workers.map((worker) => ({ name: worker.name, role: worker.role, area: worker.area, status: "Active" })),
    stock: stockRows.length ? stockRows : stockItems,
    errors: [farmResult.error, blocksResult.error, workersResult.error, stockResult.error].flatMap((error) =>
      error ? [error.message] : []
    )
  };
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await loadFarmData();
  const workerNames = data.workers.map((worker) => worker.name);
  const roleNames = ["Admin", "Manager", "User"];
  const blockNames = data.blocks.map((block) => block.name);
  const stockNames = data.stock.map((item) => item.name);
  const totalAcres = data.blocks.reduce((total, block) => total + block.acres, 0);
  const lowStockCount = data.stock.filter((item) => ["low", "reorder"].includes(item.status.toLowerCase())).length;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CF</div>
          <div>
            <strong>{data.farmName}</strong>
            <span>125-acre operations</span>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a key={item.id} href={`#${item.id}`} className="nav-button">
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>Creative Farm Operations</h1>
            <p>Production foundation connected to Supabase/PostgreSQL masters.</p>
          </div>
          <div className="topbar-actions">
            <Pill tone="warn">Offline-first planned</Pill>
            <Pill tone={data.source === "supabase" ? "good" : "warn"}>
              {data.source === "supabase" ? "Supabase connected" : "Sample fallback"}
            </Pill>
            <form action={logout}>
              <button className="button secondary-button">Sign out</button>
            </form>
          </div>
        </header>

        <div className="content">
          {data.errors?.length ? (
            <section className="notice">
              <strong>Supabase read warning</strong>
              <span>{data.errors.join(" | ")}</span>
            </section>
          ) : null}

          <ModuleSection id="dashboard" title="Dashboard">
            <div className="kpi-grid">
              <Card title="Blocks" action={<Pill tone="good">{data.blocks.length} active</Pill>}>
                <strong className="metric">{totalAcres || 125} acres</strong>
                <p>Farm structure is block-first, then rows, then tree exceptions.</p>
              </Card>
              <Card title="Workers" action={<Pill>{data.workers.length} users</Pill>}>
                <strong className="metric">3 roles</strong>
                <p>Admin, Manager, and User are the current access masters.</p>
              </Card>
              <Card title="Stock" action={<Pill tone={lowStockCount ? "warn" : "good"}>{lowStockCount} low</Pill>}>
                <strong className="metric">{data.stock.length} items</strong>
                <p>Fertilizer, pesticide, fuel, and spares will connect to inventory tables.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="planning" title="Work Plan">
            <div className="grid-two">
              <Card title="Create Work Plan" action={<Pill>Next build</Pill>}>
                <div className="entry-grid">
                  <Field label="Date" type="date" />
                  <Field label="Activity" options={["Irrigation", "Labor", "Drip repair", "Pest treatment", "Fertigation", "Harvest"]} />
                  <Field label="Block" options={blockNames} />
                  <Field label="Assigned To" options={workerNames} />
                </div>
              </Card>
              <Card title="Planned Work" action={<Pill tone="warn">Pending DB write</Pill>}>
                <p>Work plan entries will save to work orders and activity schedules.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="structure" title="Farm Structure">
            <div className="grid-two">
              <Card title="Farm Structure" action={<Pill>Master</Pill>}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Block</th>
                      <th>Acres</th>
                      <th>Rows</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.blocks.map((block) => (
                      <tr key={block.name}>
                        <td>{block.name}</td>
                        <td>{block.acres}</td>
                        <td>{block.rowCount}</td>
                        <td>{block.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </Card>

              <Card title="Rows & Plots" action={<Pill tone="info">Next build</Pill>}>
                <p>Rows and plot maintenance will use the selected farm block master.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="irrigation" title="Irrigation">
            <div className="grid-two">
              <Card title="Irrigation Entry" action={<Pill>Block / row</Pill>}>
                <div className="entry-grid">
                  <Field label="Date" type="date" />
                  <Field label="Block" options={blockNames} />
                  <Field label="Water Source" options={["Bore Motor 1", "Bore Motor 2", "Farm Pond", "Water Tank"]} />
                  <Field label="Drip Condition" options={["Good", "Leak found", "Emitter blocked", "Valve issue"]} />
                </div>
              </Card>
              <Card title="Irrigation Status" action={<Pill tone="warn">Pending DB write</Pill>}>
                <p>Saved irrigation entries will flow into daily reports and block history.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="fertigation" title="Fertigation">
            <div className="grid-two">
              <Card title="Fertigation Entry" action={<Pill>Stock linked</Pill>}>
                <div className="entry-grid">
                  <Field label="Date" type="date" />
                  <Field label="Block" options={blockNames} />
                  <Field label="Fertilizer" options={stockNames} />
                  <Field label="Quantity Used" type="number" />
                </div>
              </Card>
              <Card title="Stock Control" action={<Pill tone="info">Approval workflow</Pill>}>
                <p>Fertilizer use will reduce stock only after usage confirmation.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="pest" title="Pest / Disease">
            <div className="grid-two">
              <Card title="Pest Observation" action={<Pill>Block / row</Pill>}>
                <div className="entry-grid">
                  <Field label="Date" type="date" />
                  <Field label="Block" options={blockNames} />
                  <Field label="Issue" options={["Red palm weevil", "Leaf spot", "Stem borer", "Root rot", "Unknown observation"]} />
                  <Field label="Severity" options={["Low", "Medium", "High"]} />
                </div>
              </Card>
              <Card title="Follow-up" action={<Pill tone="warn">Work order linked</Pill>}>
                <p>High severity observations should create a work order or tree issue follow-up.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="exceptions" title="Tree Issues">
            <div className="grid-two">
              <Card title="Tree Exception" action={<Pill>Exception only</Pill>}>
                <div className="entry-grid">
                  <Field label="Block" options={blockNames} />
                  <Field label="Tree Number" type="number" />
                  <Field label="Issue Type" options={["Fallen tree", "Dead tree / mortality", "Replanting", "Disease affected", "Special observation"]} />
                  <Field label="Severity" options={["Low", "Medium", "High"]} />
                </div>
              </Card>
              <Card title="Tree-level Rule" action={<Pill tone="info">Not routine</Pill>}>
                <p>Routine farm work stays block/row-wise. Tree-level tracking is only for exceptions.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="labor" title="Labor">
            <div className="grid-two">
              <Card title="Labor Entry" action={<Pill>Uses worker master</Pill>}>
                <div className="entry-grid">
                  <Field label="Date" type="date" />
                  <Field label="Block" options={blockNames} />
                  <Field label="Worker Name" options={workerNames} />
                  <Field label="Worker Type" options={roleNames} />
                  <Field label="Activity" options={["Irrigation", "Weeding", "Pruning", "Harvest prep", "Repair support"]} />
                  <Field label="Work Hours" type="number" placeholder="Hours" />
                </div>
                <button className="button">Save Labor</button>
              </Card>
              <Card title="Labor Cost" action={<Pill tone="info">Farm Costs</Pill>}>
                <p>Salary, bonus, and labor expenses are captured under Farm Costs.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="stock" title="Stock">
            <div className="grid-two">
              <Card title="Stock Usage" action={<Pill tone="good">Inventory linked</Pill>}>
                <div className="entry-grid">
                  <Field label="Action" options={["Issue to field", "Return from field", "Adjustment"]} />
                  <Field label="Item" options={stockNames} />
                  <Field label="Quantity" type="number" />
                  <Field label="Block / Use" options={["Fertigation", "Pest spray", "Equipment service", ...blockNames]} />
                </div>
                <button className="button">Save Stock Use</button>
              </Card>

              <Card title="Current Stock" action={<Pill>{data.stock.length} items</Pill>}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Qty</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.stock.map((item) => (
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td>{item.type}</td>
                          <td>{item.qty}</td>
                          <td>{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="harvest" title="Harvest">
            <div className="grid-two">
              <Card title="Harvest Batch" action={<Pill>Batch-wise</Pill>}>
                <div className="entry-grid">
                  <Field label="Batch Code" placeholder="HB-2026-South" />
                  <Field label="Block" options={blockNames} />
                  <Field label="Quantity Kg" type="number" />
                  <Field label="Buyer" options={["Local market", "Direct buyer", "Processor", "Farm use"]} />
                </div>
              </Card>
              <Card title="Harvest Reporting" action={<Pill tone="info">Next build</Pill>}>
                <p>Harvest batches will support yield and cost per kg reporting.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="equipment" title="Equipment">
            <div className="grid-two">
              <Card title="Equipment Activity" action={<Pill>Property master</Pill>}>
                <div className="entry-grid">
                  <Field label="Date" type="date" />
                  <Field label="Equipment" options={["Tractor", "JCB", "Water Tank", "Trailer"]} />
                  <Field label="Activity" options={["Running", "Fuel refill", "Cleaning", "Minor repair", "Inspection"]} />
                  <Field label="Running Hours" type="number" />
                </div>
              </Card>
              <Card title="Equipment Costs" action={<Pill tone="info">Farm Costs</Pill>}>
                <p>Repair, fuel, and maintenance expenses are captured under Farm Costs.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="workorders" title="Work Orders">
            <div className="grid-two">
              <Card title="Create Work Order" action={<Pill>Assign worker</Pill>}>
                <div className="entry-grid">
                  <Field label="Work Type" options={["Drip repair", "Pest spray", "Fertigation", "Tree replacement", "Harvest prep"]} />
                  <Field label="Block" options={blockNames} />
                  <Field label="Assigned To" options={workerNames} />
                  <Field label="Due Date" type="date" />
                </div>
              </Card>
              <Card title="Work Board" action={<Pill tone="warn">Pending DB write</Pill>}>
                <p>Open, in-progress, overdue, and completed work orders will appear here.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="approvals" title="Input Approval">
            <div className="grid-two">
              <Card title="Create Usage Plan" action={<Pill>Manager</Pill>}>
                <div className="entry-grid">
                  <Field label="Planned For" type="date" />
                  <Field label="Block" options={blockNames} />
                  <Field label="Inventory Item" options={stockNames} />
                  <Field label="Issue To" options={workerNames} />
                </div>
              </Card>
              <Card title="Approval Flow" action={<Pill tone="info">Stock control</Pill>}>
                <ol className="steps">
                  <li>Manager creates usage plan.</li>
                  <li>Stock Person issues input.</li>
                  <li>Field worker confirms usage.</li>
                  <li>System reduces stock.</li>
                </ol>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="costs" title="Farm Costs">
            <div className="grid-two">
              <Card title="Farm Costs" action={<Pill>Expense capture</Pill>}>
                <div className="entry-grid single">
                  <Field label="Date" type="date" />
                  <Field label="Cost Type" options={costTypes} />
                  <Field label="Linked Module" options={navItems.map((item) => item.label)} />
                  <Field label="Amount" type="number" placeholder="Cost amount" />
                </div>
                <button className="button">Save Expense</button>
              </Card>

              <Card title="Cost Relationships" action={<Pill tone="info">Master linked</Pill>}>
                <p>Costs can be linked to block, module, worker, equipment, stock, harvest, or miscellaneous activity.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="reports" title="Reports">
            <div className="grid-two">
              <Card title="Reports" action={<Pill>Next build</Pill>}>
                <p>Daily, weekly, monthly, and yearly reports will summarize farm activity and cost performance.</p>
              </Card>
              <Card title="Owner View" action={<Pill tone="info">Dashboard</Pill>}>
                <p>Report filters will use blocks, workers, stock, expenses, and harvest batches.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="users" title="Users & Roles">
            <div className="grid-two">
              <Card title="Role Matrix" action={<Pill>Admin master</Pill>}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Admin</td>
                        <td>Add workers, approve, update, delete, reports</td>
                      </tr>
                      <tr>
                        <td>Manager</td>
                        <td>Add entries, farm structure, stock, harvest</td>
                      </tr>
                      <tr>
                        <td>User</td>
                        <td>Assigned entries only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card title="Worker Access" action={<Pill>{data.workers.length} workers</Pill>}>
                <p>Worker role and area assignments come from the Admin worker master.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="sync" title="Sync & Backup">
            <div className="grid-two">
              <Card title="Offline Sync" action={<Pill tone="warn">Planned</Pill>}>
                <p>Field entries will be queued locally when offline and synced to Supabase when internet returns.</p>
              </Card>
              <Card title="Backup" action={<Pill tone="info">Supabase</Pill>}>
                <p>Cloud data lives in Supabase Postgres. Monthly exports can be added after reports are stable.</p>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="admin" title="Admin">
            <div className="grid-two">
              <Card title="Worker Master" action={<Pill>Supabase</Pill>}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Worker</th>
                        <th>Role</th>
                        <th>Area</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.workers.map((worker) => (
                        <tr key={worker.name}>
                          <td>{worker.name}</td>
                          <td>{worker.role}</td>
                          <td>{worker.area}</td>
                          <td>{worker.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card title="Admin Workers & Roles" action={<Pill tone="warn">Admin only</Pill>}>
                <div className="entry-grid">
                  <Field label="Worker Name" placeholder="Worker name" />
                  <Field label="Mobile Number" placeholder="Phone number" />
                  <Field label="Role" options={roleNames} />
                  <Field label="Assigned Area" options={["All sections", "All Blocks", ...blockNames, "Stock only"]} />
                </div>
                <button className="button">Save Worker</button>
              </Card>
            </div>
          </ModuleSection>

          <ModuleSection id="database" title="Database">
            <div className="grid-two">
              <Card title="Database Build Slice" action={<Pill tone="info">Next step</Pill>}>
                <ol className="steps">
                  <li>Connect forms to database insert/read operations.</li>
                  <li>Add role-based permissions for Admin, Manager, and User actions.</li>
                  <li>Add offline queue for field entries.</li>
                  <li>Build reports from Supabase data.</li>
                </ol>
              </Card>
              <Card title="Supabase Status" action={<Pill tone={data.source === "supabase" ? "good" : "warn"}>{data.source}</Pill>}>
                <p>Master reads currently load farm blocks, workers, and inventory items.</p>
              </Card>
            </div>
          </ModuleSection>
        </div>
      </section>
    </main>
  );
}
