"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResult = { ok: true } | { ok: false; error: string };

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

export async function createFarmExpense(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be signed in.");
    }

    const { data: worker, error: workerError } = await supabase
      .from("worker_profiles")
      .select("id, farm_id, role")
      .eq("auth_user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (workerError) {
      throw new Error(workerError.message);
    }

    if (!worker || !["admin", "manager"].includes(worker.role)) {
      throw new Error("Only Admin or Manager can add farm costs.");
    }

    const expenseDate = textValue(formData, "expense_date");
    const costType = textValue(formData, "cost_type");
    const amount = numberValue(formData, "amount");
    const farmPropertyId = textValue(formData, "farm_property_id");
    const propertyCount = numberValue(formData, "property_count");

    if (!expenseDate || !costType || !farmPropertyId || amount <= 0) {
      throw new Error("Date, cost type, farm property, and amount are required.");
    }

    const { error } = await supabase.from("expenses").insert({
      farm_id: worker.farm_id,
      expense_date: expenseDate,
      cost_type: costType,
      linked_module: textValue(formData, "linked_module") || "Farm Costs",
      block_id: textValue(formData, "block_id") || null,
      farm_property_id: farmPropertyId,
      property_count: propertyCount || null,
      expense_for: textValue(formData, "expense_for") || textValue(formData, "farm_property_name"),
      amount,
      paid_by: textValue(formData, "paid_by") || "Cash",
      payment_status: textValue(formData, "payment_status") || "paid",
      notes: textValue(formData, "notes") || null,
      created_by: worker.id
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/farm-costs");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}
