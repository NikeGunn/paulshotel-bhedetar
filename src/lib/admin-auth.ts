import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Shared admin-auth + audit helpers. Centralizes the `requireAuth()` gate that
 * was previously copy-pasted across action files (DRY), and provides a
 * best-effort audit-log writer.
 */

/** The authenticated admin (id + email), or redirect to login. */
export async function requireAdmin(): Promise<{ id: string; email: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { id: user.id, email: user.email ?? "" };
}

/**
 * Append an entry to admin_audit_log. Best-effort: never throws, never blocks
 * the action it records. A failed audit write must not fail the operation.
 */
export async function audit(
  actorEmail: string,
  action: string,
  detail?: string,
): Promise<void> {
  try {
    const db = createAdminClient();
    await db
      .from("admin_audit_log")
      .insert({ actor_email: actorEmail, action, detail: detail ?? null });
  } catch {
    // swallow — auditing is advisory, not critical-path
  }
}

export type AuditEntry = {
  id: string;
  actor_email: string | null;
  action: string;
  detail: string | null;
  created_at: string;
};

/**
 * Read the most recent audit entries (default 20). Single indexed query on
 * (created_at desc) + LIMIT — cheap on the free plan. Never throws.
 */
export async function recentAudit(limit = 20): Promise<AuditEntry[]> {
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("admin_audit_log")
      .select("id,actor_email,action,detail,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data as AuditEntry[]) ?? [];
  } catch {
    return [];
  }
}
