import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getCurrentWorkerRole() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("worker_profiles")
    .select("role")
    .eq("auth_user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  return data?.role ?? null;
}
