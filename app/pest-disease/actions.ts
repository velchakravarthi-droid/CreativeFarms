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

export async function createPestDiseaseIssue(formData: FormData): Promise<ActionResult> {
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

    const observedOn = textValue(formData, "observed_on");
    const blockId = textValue(formData, "block_id");
    const rowId = textValue(formData, "row_id");
    const treeType = textValue(formData, "tree_type");
    const issueCategory = textValue(formData, "issue_category");
    const issueStatus = textValue(formData, "issue_status");
    const comments = textValue(formData, "comments");

    if (!observedOn || !blockId || !rowId || !treeType || !issueCategory || !issueStatus || !comments) {
      throw new Error("Date, block, row, tree type, issue type, status, and comments are required.");
    }

    const { error } = await supabase.from("tree_exceptions").insert({
      farm_id: worker.farm_id,
      block_id: blockId,
      row_id: rowId,
      tree_type: treeType,
      issue_category: issueCategory,
      issue_status: issueStatus,
      issue_type: comments,
      severity: "Medium",
      observed_on: observedOn,
      notes: comments,
      created_by: worker.id
    });

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/pest-disease");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}
