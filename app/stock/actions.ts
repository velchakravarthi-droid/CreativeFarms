"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResult = { ok: true } | { ok: false; error: string };
type StockItemRow = {
  item_id: string;
  farm_id: string;
  base_unit: string;
  has_package: boolean;
  package_name: string | null;
  package_quantity: number | null;
};

type StockBalanceRow = {
  current_base_quantity: number;
};

async function requireStockManager() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data: worker, error } = await supabase
    .from("worker_profiles")
    .select("id, farm_id, role")
    .eq("auth_user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!worker || !["admin", "manager"].includes(worker.role)) {
    throw new Error("Only Admin or Manager can maintain stock.");
  }

  return { supabase, worker };
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function numberValue(formData: FormData, key: string) {
  const value = Number(textValue(formData, key));
  return Number.isFinite(value) ? value : 0;
}

function actionError(error: unknown): ActionResult {
  return {
    ok: false,
    error: error instanceof Error ? error.message : "Transaction failed."
  };
}

async function loadStockItem(supabase: Awaited<ReturnType<typeof createClient>>, itemId: string) {
  const { data, error } = await supabase
    .from("stock_item")
    .select("item_id, farm_id, base_unit, has_package, package_name, package_quantity")
    .eq("item_id", itemId)
    .eq("is_deleted", false)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Stock item was not found.");
  }

  return data as StockItemRow;
}

function calculateBaseQuantity(item: StockItemRow, formData: FormData) {
  if (item.has_package) {
    const packageCount = numberValue(formData, "package_count");
    const quantityPerPackage = numberValue(formData, "quantity_per_package") || Number(item.package_quantity ?? 0);

    if (packageCount <= 0 || quantityPerPackage <= 0) {
      throw new Error("Package count and quantity per package must be greater than zero.");
    }

    return { baseQuantity: packageCount * quantityPerPackage, packageCount, quantityPerPackage };
  }

  const quantity = numberValue(formData, "quantity");

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  return { baseQuantity: quantity, packageCount: null, quantityPerPackage: null };
}

async function upsertBalance(
  supabase: Awaited<ReturnType<typeof createClient>>,
  item: StockItemRow,
  baseQuantity: number,
  transactionDate: string,
  direction: "ADD" | "REDUCE"
) {
  const { data: balanceData, error: balanceError } = await supabase
    .from("stock_balance")
    .select("current_base_quantity")
    .eq("item_id", item.item_id)
    .maybeSingle();

  if (balanceError) {
    throw new Error(balanceError.message);
  }

  const current = Number((balanceData as StockBalanceRow | null)?.current_base_quantity ?? 0);
  const next = direction === "ADD" ? current + baseQuantity : current - baseQuantity;

  if (next < 0) {
    throw new Error("Cannot reduce more stock than available.");
  }

  const currentPackageCount = item.has_package && item.package_quantity ? next / Number(item.package_quantity) : null;

  const { error } = await supabase.from("stock_balance").upsert(
    {
      farm_id: item.farm_id,
      item_id: item.item_id,
      current_base_quantity: next,
      base_unit: item.base_unit,
      current_package_count: currentPackageCount,
      package_name: item.package_name,
      last_transaction_date: transactionDate,
      updated_at: new Date().toISOString(),
      is_deleted: false
    },
    { onConflict: "farm_id,item_id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function ensureSufficientStock(
  supabase: Awaited<ReturnType<typeof createClient>>,
  item: StockItemRow,
  baseQuantity: number
) {
  const { data, error } = await supabase
    .from("stock_balance")
    .select("current_base_quantity")
    .eq("item_id", item.item_id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const current = Number((data as StockBalanceRow | null)?.current_base_quantity ?? 0);

  if (current < baseQuantity) {
    throw new Error("Cannot reduce more stock than available.");
  }
}

export async function createStockCategory(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, worker } = await requireStockManager();
    const categoryName = textValue(formData, "category_name");

    if (!categoryName) {
      throw new Error("Category name is required.");
    }

    const { error } = await supabase.from("stock_category").insert({
      farm_id: worker.farm_id,
      category_name: categoryName,
      description: textValue(formData, "description") || null,
      created_by: worker.id,
      updated_by: worker.id
    });

    if (error) throw new Error(error.message);
    revalidatePath("/stock");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function createStockType(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, worker } = await requireStockManager();
    const categoryId = textValue(formData, "category_id");
    const stockTypeName = textValue(formData, "stock_type_name");

    if (!categoryId || !stockTypeName) {
      throw new Error("Category and stock type are required.");
    }

    const { error } = await supabase.from("stock_type").insert({
      farm_id: worker.farm_id,
      category_id: categoryId,
      stock_type_name: stockTypeName,
      description: textValue(formData, "description") || null,
      created_by: worker.id,
      updated_by: worker.id
    });

    if (error) throw new Error(error.message);
    revalidatePath("/stock");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function createStockItem(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, worker } = await requireStockManager();
    const categoryId = textValue(formData, "category_id");
    const itemName = textValue(formData, "item_name");
    const baseUnit = textValue(formData, "base_unit");
    const hasPackage = textValue(formData, "has_package") === "true";

    if (!categoryId || !itemName || !baseUnit) {
      throw new Error("Category, item name, and base unit are required.");
    }

    if (hasPackage && (!textValue(formData, "package_name") || numberValue(formData, "package_quantity") <= 0 || !textValue(formData, "package_unit"))) {
      throw new Error("Package name, quantity, and unit are required for packaged items.");
    }

    const { data, error } = await supabase
      .from("stock_item")
      .insert({
        farm_id: worker.farm_id,
        category_id: categoryId,
        stock_type_id: textValue(formData, "stock_type_id") || null,
        item_name: itemName,
        base_unit: baseUnit,
        has_package: hasPackage,
        package_name: hasPackage ? textValue(formData, "package_name") : null,
        package_quantity: hasPackage ? numberValue(formData, "package_quantity") : null,
        package_unit: hasPackage ? textValue(formData, "package_unit") : null,
        minimum_stock_quantity: numberValue(formData, "minimum_stock_quantity") || null,
        minimum_stock_unit: textValue(formData, "minimum_stock_unit") || null,
        is_active: textValue(formData, "is_active") !== "false",
        created_by: worker.id,
        updated_by: worker.id
      })
      .select("item_id, farm_id, base_unit, has_package, package_name, package_quantity")
      .single();

    if (error) throw new Error(error.message);

    const item = data as StockItemRow;
    await upsertBalance(supabase, item, 0, new Date().toISOString().slice(0, 10), "ADD");
    revalidatePath("/stock");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function addStock(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, worker } = await requireStockManager();
    const itemId = textValue(formData, "item_id");
    const transactionDate = textValue(formData, "transaction_date");

    if (!itemId || !transactionDate) {
      throw new Error("Stock item and purchase date are required.");
    }

    const item = await loadStockItem(supabase, itemId);
    const { baseQuantity, packageCount, quantityPerPackage } = calculateBaseQuantity(item, formData);
    const costPerUnit = numberValue(formData, "cost_per_unit");
    const totalCost = costPerUnit > 0 ? costPerUnit * (packageCount ?? baseQuantity) : numberValue(formData, "total_cost") || null;

    const { error } = await supabase.from("stock_transaction").insert({
      farm_id: worker.farm_id,
      item_id: item.item_id,
      transaction_type: "ADD",
      transaction_date: transactionDate,
      quantity: packageCount ?? baseQuantity,
      quantity_unit: item.has_package ? (item.package_name ?? item.base_unit) : item.base_unit,
      package_count: packageCount,
      package_name: item.package_name,
      quantity_per_package: quantityPerPackage,
      base_quantity: baseQuantity,
      base_unit: item.base_unit,
      cost_per_unit: costPerUnit || null,
      total_cost: totalCost,
      supplier_name: textValue(formData, "supplier_name") || null,
      invoice_number: textValue(formData, "invoice_number") || null,
      storage_location: textValue(formData, "storage_location") || null,
      notes: textValue(formData, "notes") || null,
      created_by: worker.id,
      updated_by: worker.id
    });

    if (error) throw new Error(error.message);
    await upsertBalance(supabase, item, baseQuantity, transactionDate, "ADD");
    revalidatePath("/stock");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function reduceStock(formData: FormData): Promise<ActionResult> {
  try {
    const { supabase, worker } = await requireStockManager();
    const itemId = textValue(formData, "item_id");
    const transactionDate = textValue(formData, "transaction_date");
    const usedFor = textValue(formData, "used_for");

    if (!itemId || !transactionDate || !usedFor) {
      throw new Error("Stock item, usage date, and used-for purpose are required.");
    }

    const item = await loadStockItem(supabase, itemId);
    const { baseQuantity, packageCount, quantityPerPackage } = calculateBaseQuantity(item, formData);
    await ensureSufficientStock(supabase, item, baseQuantity);

    const { error } = await supabase.from("stock_transaction").insert({
      farm_id: worker.farm_id,
      item_id: item.item_id,
      transaction_type: "REDUCE",
      transaction_date: transactionDate,
      quantity: packageCount ?? baseQuantity,
      quantity_unit: item.has_package ? (item.package_name ?? item.base_unit) : item.base_unit,
      package_count: packageCount,
      package_name: item.package_name,
      quantity_per_package: quantityPerPackage,
      base_quantity: baseQuantity,
      base_unit: item.base_unit,
      used_for: usedFor,
      zone_id: textValue(formData, "zone_id") || null,
      row_range: textValue(formData, "row_range") || null,
      worker_name: textValue(formData, "worker_name") || null,
      notes: textValue(formData, "notes") || null,
      created_by: worker.id,
      updated_by: worker.id
    });

    if (error) throw new Error(error.message);
    await upsertBalance(supabase, item, baseQuantity, transactionDate, "REDUCE");
    revalidatePath("/stock");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}
