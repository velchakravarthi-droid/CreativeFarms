import { createAdminClient } from "@/lib/supabase/admin";

export type StockCategory = {
  categoryId: string;
  name: string;
};

export type StockType = {
  typeId: string;
  categoryId: string;
  name: string;
};

export type StockItem = {
  itemId: string;
  categoryId: string;
  typeId: string;
  categoryName: string;
  typeName: string;
  itemName: string;
  baseUnit: string;
  hasPackage: boolean;
  packageName: string;
  packageQuantity: number;
  packageUnit: string;
  minimumStockQuantity: number;
  minimumStockUnit: string;
  isActive: boolean;
};

export type StockBalance = {
  itemId: string;
  currentBaseQuantity: number;
  baseUnit: string;
  currentPackageCount: number | null;
  packageName: string;
  lastTransactionDate: string;
};

export type StockTransaction = {
  transactionId: string;
  itemId: string;
  itemName: string;
  transactionType: string;
  transactionDate: string;
  quantity: number;
  quantityUnit: string;
  baseQuantity: number;
  baseUnit: string;
  totalCost: number | null;
  usedFor: string;
  supplierName: string;
  notes: string;
  createdBy: string;
};

type StockCategoryRow = {
  category_id: string;
  category_name: string;
};

type StockTypeRow = {
  stock_type_id: string;
  category_id: string;
  stock_type_name: string;
};

type StockItemRow = {
  item_id: string;
  category_id: string;
  stock_type_id: string | null;
  item_name: string;
  base_unit: string;
  has_package: boolean;
  package_name: string | null;
  package_quantity: number | null;
  package_unit: string | null;
  minimum_stock_quantity: number | null;
  minimum_stock_unit: string | null;
  is_active: boolean;
  stock_category?: { category_name: string } | { category_name: string }[] | null;
  stock_type?: { stock_type_name: string } | { stock_type_name: string }[] | null;
};

type StockBalanceRow = {
  item_id: string;
  current_base_quantity: number;
  base_unit: string;
  current_package_count: number | null;
  package_name: string | null;
  last_transaction_date: string | null;
};

type StockTransactionRow = {
  transaction_id: string;
  item_id: string;
  transaction_type: string;
  transaction_date: string;
  quantity: number;
  quantity_unit: string;
  base_quantity: number;
  base_unit: string;
  total_cost: number | null;
  used_for: string | null;
  supplier_name: string | null;
  notes: string | null;
  stock_item?: { item_name: string } | { item_name: string }[] | null;
};

export async function loadStockData() {
  const supabase = createAdminClient();

  if (!supabase) {
    return { categories: [], types: [], items: [], balances: [], transactions: [] };
  }

  const [categoriesResult, typesResult, itemsResult, balancesResult, transactionsResult] = await Promise.all([
    supabase.from("stock_category").select("category_id, category_name").eq("is_deleted", false).order("category_name"),
    supabase.from("stock_type").select("stock_type_id, category_id, stock_type_name").eq("is_deleted", false).order("stock_type_name"),
    supabase
      .from("stock_item")
      .select(
        "item_id, category_id, stock_type_id, item_name, base_unit, has_package, package_name, package_quantity, package_unit, minimum_stock_quantity, minimum_stock_unit, is_active, stock_category(category_name), stock_type(stock_type_name)"
      )
      .eq("is_deleted", false)
      .order("item_name"),
    supabase
      .from("stock_balance")
      .select("item_id, current_base_quantity, base_unit, current_package_count, package_name, last_transaction_date")
      .eq("is_deleted", false),
    supabase
      .from("stock_transaction")
      .select(
        "transaction_id, item_id, transaction_type, transaction_date, quantity, quantity_unit, base_quantity, base_unit, total_cost, used_for, supplier_name, notes, stock_item(item_name)"
      )
      .eq("is_deleted", false)
      .order("transaction_date", { ascending: false })
      .limit(100)
  ]);

  const categories = ((categoriesResult.data ?? []) as StockCategoryRow[]).map((category) => ({
    categoryId: category.category_id,
    name: category.category_name
  }));

  const types = ((typesResult.data ?? []) as StockTypeRow[]).map((type) => ({
    typeId: type.stock_type_id,
    categoryId: type.category_id,
    name: type.stock_type_name
  }));

  const items = ((itemsResult.data ?? []) as StockItemRow[]).map((item) => {
    const category = firstRelated(item.stock_category);
    const type = firstRelated(item.stock_type);

    return {
      itemId: item.item_id,
      categoryId: item.category_id,
      typeId: item.stock_type_id ?? "",
      categoryName: category?.category_name ?? "Category",
      typeName: type?.stock_type_name ?? "",
      itemName: item.item_name,
      baseUnit: item.base_unit,
      hasPackage: item.has_package,
      packageName: item.package_name ?? "",
      packageQuantity: Number(item.package_quantity ?? 0),
      packageUnit: item.package_unit ?? "",
      minimumStockQuantity: Number(item.minimum_stock_quantity ?? 0),
      minimumStockUnit: item.minimum_stock_unit ?? "",
      isActive: item.is_active
    };
  });

  const balances = ((balancesResult.data ?? []) as StockBalanceRow[]).map((balance) => ({
    itemId: balance.item_id,
    currentBaseQuantity: Number(balance.current_base_quantity ?? 0),
    baseUnit: balance.base_unit,
    currentPackageCount: balance.current_package_count === null ? null : Number(balance.current_package_count),
    packageName: balance.package_name ?? "",
    lastTransactionDate: balance.last_transaction_date ?? ""
  }));

  const transactions = ((transactionsResult.data ?? []) as StockTransactionRow[]).map((transaction) => {
    const item = firstRelated(transaction.stock_item);

    return {
      transactionId: transaction.transaction_id,
      itemId: transaction.item_id,
      itemName: item?.item_name ?? "Stock item",
      transactionType: transaction.transaction_type,
      transactionDate: transaction.transaction_date,
      quantity: Number(transaction.quantity ?? 0),
      quantityUnit: transaction.quantity_unit,
      baseQuantity: Number(transaction.base_quantity ?? 0),
      baseUnit: transaction.base_unit,
      totalCost: transaction.total_cost === null ? null : Number(transaction.total_cost),
      usedFor: transaction.used_for ?? "",
      supplierName: transaction.supplier_name ?? "",
      notes: transaction.notes ?? "",
      createdBy: ""
    };
  });

  return { categories, types, items, balances, transactions };
}

function firstRelated<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
