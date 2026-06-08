import { farmBlocks, farmProperties, stockItems, treeTypeAssignments, workers } from "@/lib/farm-data";
import { createAdminClient } from "@/lib/supabase/admin";

type FarmBlockRow = {
  id: string;
  name: string;
  acres: number | null;
  status: string;
  notes?: string | null;
  farm_rows?: { id: string; name?: string | null; status?: string | null }[];
};

type FarmPropertyRow = {
  id: string;
  property_type: string;
  name: string;
  quantity: number | null;
  status: string;
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

type TreeAssignmentRow = {
  id: string;
  tree_count: number | null;
  row_range: string | null;
  status: string;
  notes: string | null;
  farm_properties?: { property_type: string; name: string } | null;
  farm_blocks?: { name: string } | null;
  farm_rows?: { name: string | null } | null;
};

export async function loadFarmData() {
  const supabase = createAdminClient();

  if (!supabase) {
    return sampleData("sample");
  }

  const [farmResult, blocksResult, propertiesResult, treeAssignmentsResult, workersResult, stockResult] = await Promise.all([
    supabase.from("farms").select("id, name, total_acres").order("created_at", { ascending: true }).limit(1).maybeSingle(),
    supabase
      .from("farm_blocks")
      .select("id, name, acres, status, notes, farm_rows(id, name, status)")
      .order("name"),
    supabase.from("farm_properties").select("id, property_type, name, quantity, status").order("property_type").order("name"),
    supabase
      .from("tree_type_assignments")
      .select(
        "id, tree_count, row_range, status, notes, farm_properties(property_type, name), farm_blocks(name), farm_rows(name)"
      )
      .order("created_at", { ascending: false }),
    supabase.from("worker_profiles").select("id, full_name, role, access_area, status").order("full_name"),
    supabase.from("inventory_items").select("id, name, category, item_type, current_stock, unit, status").order("name")
  ]);

  const blocks = ((blocksResult.data ?? []) as FarmBlockRow[]).map((block) => ({
    id: block.id,
    name: block.name,
    acres: Number(block.acres ?? 0),
    rowCount: block.farm_rows?.length ?? 0,
    rows:
      block.farm_rows?.map((row) => ({
        id: row.id,
        name: row.name ?? "Row",
        status: row.status ?? "active"
      })) ?? [],
    status: block.status,
    notes: block.notes ?? ""
  }));

  const properties = ((propertiesResult.data ?? []) as FarmPropertyRow[]).map((property) => ({
    id: property.id,
    type: property.property_type,
    name: property.name,
    quantity: property.quantity?.toString() ?? "",
    status: property.status
  }));

  const assignmentRows = ((treeAssignmentsResult.data ?? []) as TreeAssignmentRow[]).map((assignment) => ({
    id: assignment.id,
    propertyType: assignment.farm_properties?.property_type ?? "Tree",
    propertyName: assignment.farm_properties?.name ?? "Tree",
    block: assignment.farm_blocks?.name ?? "All Blocks",
    row: assignment.farm_rows?.name ?? assignment.row_range ?? "All Rows",
    count: assignment.tree_count ?? 0,
    status: assignment.status,
    notes: assignment.notes ?? ""
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

  const fallback = sampleData("supabase");

  return {
    source: "supabase",
    farmId: farmResult.data?.id ?? null,
    farmName: farmResult.data?.name ?? "Creative Farm",
    totalAcres: Number(farmResult.data?.total_acres ?? 0),
    blocks: blocks.length ? blocks : fallback.blocks,
    properties: properties.length ? properties : fallback.properties,
    treeAssignments: assignmentRows.length ? assignmentRows : fallback.treeAssignments,
    workers: workerRows.length ? workerRows : fallback.workers,
    stock: stockRows.length ? stockRows : fallback.stock,
    errors: [farmResult.error, blocksResult.error, propertiesResult.error, treeAssignmentsResult.error, workersResult.error, stockResult.error].flatMap(
      (error) => (error ? [error.message] : [])
    )
  };
}

function sampleData(source: "sample" | "supabase") {
  return {
    source,
    farmId: null,
    farmName: "Creative Farm",
    totalAcres: 125,
    blocks: farmBlocks.map((block, index) => ({
      id: `sample-block-${index}`,
      ...block,
      rowCount: block.rows,
      rows: Array.from({ length: Math.min(block.rows, 6) }, (_, rowIndex) => ({
        id: `sample-row-${index}-${rowIndex}`,
        name: `Row ${rowIndex + 1}`,
        rowNumber: rowIndex + 1,
        status: "active"
      })),
      notes:
        block.name === "South Block"
          ? "Primary coconut area"
          : block.name === "North West Block"
            ? "Timber and mixed trees"
            : block.name === "East Block"
              ? "Irrigation priority area"
              : "Farm support area"
    })),
    properties: farmProperties.map((property, index) => ({ id: `sample-property-${index}`, status: "active", ...property })),
    treeAssignments: treeTypeAssignments.map((assignment, index) => ({
      id: `sample-assignment-${index}`,
      status: "active",
      notes: "",
      ...assignment
    })),
    workers: workers.map((worker) => ({
      name: worker.name,
      role: worker.role,
      area: worker.area,
      status: "Active"
    })),
    stock: stockItems,
    errors: []
  };
}
