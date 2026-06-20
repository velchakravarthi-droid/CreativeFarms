import { AppShell } from "@/components/app-shell";
import { FarmCostEntry } from "@/components/farm-cost-entry";
import { requireUser } from "@/lib/auth";
import { loadFarmData } from "@/lib/load-farm-data";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type ExpenseRow = {
  id: string;
  expense_date: string;
  cost_type: string;
  property_count: number | null;
  amount: number;
  payment_status: string;
  notes: string | null;
  farm_properties?: { property_type: string; name: string } | { property_type: string; name: string }[] | null;
};

export default async function FarmCostsPage() {
  await requireUser();
  const data = await loadFarmData();
  const expenses = await loadFarmExpenses();

  return (
    <AppShell
      farmName={data.farmName}
      subtitle="Capture dated costs against farm property master items."
      status={data.source === "supabase" ? "Supabase connected" : "Sample fallback"}
      statusTone={data.source === "supabase" ? "good" : "warn"}
    >
      <div className="content">
        <section className="module-section">
          <div className="module-title">
            <h2>Farm Costs</h2>
          </div>
          <FarmCostEntry blocks={data.blocks} expenses={expenses} properties={data.properties} />
        </section>
      </div>
    </AppShell>
  );
}

async function loadFarmExpenses() {
  const supabase = createAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("id, expense_date, cost_type, property_count, amount, payment_status, notes, farm_properties(property_type, name)")
    .order("expense_date", { ascending: false })
    .limit(25);

  if (error) {
    return [];
  }

  return ((data ?? []) as ExpenseRow[]).map((expense) => {
    const property = firstRelated(expense.farm_properties);

    return {
      id: expense.id,
      expenseDate: expense.expense_date,
      costType: expense.cost_type,
      propertyName: property?.name ?? "",
      propertyType: property?.property_type ?? "",
      propertyCount: expense.property_count === null ? null : Number(expense.property_count),
      amount: Number(expense.amount ?? 0),
      paymentStatus: expense.payment_status,
      notes: expense.notes ?? ""
    };
  });
}

function firstRelated<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
