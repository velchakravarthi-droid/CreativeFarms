import { costTypes, farmBlocks, navItems, stockItems, workers } from "@/lib/farm-data";
import { createAdminClient } from "@/lib/supabase/admin";
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

type SupabaseReadError = {
  message: string;
};

function hasSupabaseError(error: SupabaseReadError | null): error is SupabaseReadError {
  return error !== null;
}

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
    errors: [farmResult.error, blocksResult.error, workersResult.error, stockResult.error].filter(hasSupabaseError).map((error) => error.message)
  };
}

export default async function Home() {
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
          </div>
        </header>

        <div className="content">
          {data.errors?.length ? (
            <section className="notice">
              <strong>Supabase read warning</strong>
              <span>{data.errors.join(" | ")}</span>
            </section>
          ) : null}

          <section id="dashboard" className="kpi-grid">
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
          </section>

          <section className="grid-two">
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
          </section>

          <section className="grid-two">
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

            <Card title="Stock Usage" action={<Pill tone="good">Inventory linked</Pill>}>
              <div className="entry-grid">
                <Field label="Action" options={["Issue to field", "Return from field", "Adjustment"]} />
                <Field label="Item" options={stockNames} />
                <Field label="Quantity" type="number" />
                <Field label="Block / Use" options={["Fertigation", "Pest spray", "Equipment service", ...blockNames]} />
              </div>
              <button className="button">Save Stock Use</button>
            </Card>
          </section>

          <section className="grid-two">
            <Card title="Farm Costs" action={<Pill>Expense capture</Pill>}>
              <div className="entry-grid single">
                <Field label="Date" type="date" />
                <Field label="Cost Type" options={costTypes} />
                <Field label="Linked Module" options={navItems.map((item) => item.label)} />
                <Field label="Amount" type="number" placeholder="Cost amount" />
              </div>
              <button className="button">Save Expense</button>
            </Card>

            <Card title="Database Build Slice" action={<Pill tone="info">Next step</Pill>}>
              <ol className="steps">
                <li>Run the Supabase migration.</li>
                <li>Add Supabase project env vars in Vercel.</li>
                <li>Connect forms to database insert/read operations.</li>
                <li>Add auth and role-based route protection.</li>
              </ol>
            </Card>
          </section>
        </div>
      </section>
    </main>
  );
}
