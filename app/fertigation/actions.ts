"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionResult = { ok: true } | { ok: false; error: string };

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function actionError(error: unknown): ActionResult {
  return {
    ok: false,
    error: error instanceof Error ? error.message : "Transaction failed."
  };
}

export async function createFertigationEntry(formData: FormData): Promise<ActionResult> {
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
      .select("id, farm_id")
      .eq("auth_user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (workerError) {
      throw new Error(workerError.message);
    }

    if (!worker) {
      throw new Error("Your login is not linked to an active worker profile.");
    }

    const activityDate = textValue(formData, "activity_date");
    const blockId = textValue(formData, "block_id");
    const rowId = textValue(formData, "row_id");
    const workerId = textValue(formData, "worker_id");
    const fertilizer = textValue(formData, "fertilizer");
    const quantity = textValue(formData, "quantity");

    if (!activityDate || !blockId || !rowId || !workerId) {
      throw new Error("Date, block, worker, and row fertigated are required.");
    }

    const notes = [
      fertilizer ? `Fertilizer: ${fertilizer}` : "",
      quantity ? `Quantity: ${quantity}` : "",
      textValue(formData, "notes")
    ]
      .filter(Boolean)
      .join(" | ");

    const { error } = await supabase.from("activity_entries").insert({
      farm_id: worker.farm_id,
      block_id: blockId,
      row_id: rowId,
      worker_id: workerId,
      activity_type: "Fertigation",
      activity_date: activityDate,
      status: "completed",
      notes: notes || null,
      created_by: worker.id
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/fertigation");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}
