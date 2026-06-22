"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  // Clearing the session must never hard-500 the admin. If Supabase is
  // unreachable or the cookie write races, swallow it and still redirect —
  // the middleware re-guards /admin, so the user ends up logged out either way.
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // ignore — fall through to the login redirect below
  }
  redirect("/admin/login");
}
