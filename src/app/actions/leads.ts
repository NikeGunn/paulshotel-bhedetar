"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setInquiryStatus(
  id: string,
  status: "new" | "contacted" | "closed",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const db = createAdminClient();
  await db.from("inquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/leads");
}
