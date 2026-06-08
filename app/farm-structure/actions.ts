"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type RecordStatus = "active" | "inactive" | "hold";

async function requireAdminWorker() {
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

  if (!worker || worker.role !== "admin") {
    throw new Error("Only Admin role can maintain farm blocks and rows.");
  }

  return { supabase, worker };
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function statusValue(formData: FormData): RecordStatus {
  const status = textValue(formData, "status");
  return status === "inactive" || status === "hold" ? status : "active";
}

function acresValue(formData: FormData) {
  const acres = Number(textValue(formData, "acres"));
  return Number.isFinite(acres) && acres >= 0 ? acres : 0;
}

export async function createBlock(formData: FormData) {
  const { supabase, worker } = await requireAdminWorker();
  const name = textValue(formData, "name");

  if (!name) {
    throw new Error("Block name is required.");
  }

  const { error } = await supabase.from("farm_blocks").insert({
    farm_id: worker.farm_id,
    name,
    acres: acresValue(formData),
    status: statusValue(formData),
    notes: textValue(formData, "notes") || null
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/farm-structure");
}

export async function updateBlock(formData: FormData) {
  const { supabase } = await requireAdminWorker();
  const id = textValue(formData, "id");
  const name = textValue(formData, "name");

  if (!id || !name) {
    throw new Error("Block and block name are required.");
  }

  const { error } = await supabase
    .from("farm_blocks")
    .update({
      name,
      acres: acresValue(formData),
      status: statusValue(formData),
      notes: textValue(formData, "notes") || null
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/farm-structure");
}

export async function deleteBlock(formData: FormData) {
  const { supabase } = await requireAdminWorker();
  const id = textValue(formData, "id");

  if (!id) {
    throw new Error("Block is required.");
  }

  const { error } = await supabase.from("farm_blocks").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/farm-structure");
}

export async function createRow(formData: FormData) {
  const { supabase } = await requireAdminWorker();
  const blockId = textValue(formData, "block_id");
  const name = textValue(formData, "name");

  if (!blockId || !name) {
    throw new Error("Block and row name are required.");
  }

  const { error } = await supabase.from("farm_rows").insert({
    block_id: blockId,
    name,
    status: statusValue(formData),
    notes: textValue(formData, "notes") || null
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/farm-structure");
}

export async function updateRow(formData: FormData) {
  const { supabase } = await requireAdminWorker();
  const id = textValue(formData, "id");
  const name = textValue(formData, "name");

  if (!id || !name) {
    throw new Error("Row and row name are required.");
  }

  const { error } = await supabase
    .from("farm_rows")
    .update({
      name,
      status: statusValue(formData),
      notes: textValue(formData, "notes") || null
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/farm-structure");
}

export async function deleteRow(formData: FormData) {
  const { supabase } = await requireAdminWorker();
  const id = textValue(formData, "id");

  if (!id) {
    throw new Error("Row is required.");
  }

  const { error } = await supabase.from("farm_rows").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/farm-structure");
}
