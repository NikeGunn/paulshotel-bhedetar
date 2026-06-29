"use server";

import { revalidatePath } from "next/cache";
import { createClient as createSsrClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, audit } from "@/lib/admin-auth";

export type AccountFormState = { ok?: boolean; error?: string; message?: string };

/**
 * Re-verify the admin's CURRENT password by attempting a fresh password sign-in
 * with a throwaway (no-session) client. Returns true on success. This is the
 * security gate before any sensitive account change — it proves the person at
 * the keyboard is the account owner, not just a holder of a live cookie.
 */
async function verifyPassword(email: string, password: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return false;
  try {
    const probe = createSsrClient(url, anon, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await probe.auth.signInWithPassword({ email, password });
    return !error;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- password
const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    next: z.string().min(8, "New password must be at least 8 characters."),
    confirm: z.string().min(1, "Confirm your new password."),
  })
  .refine((d) => d.next === d.confirm, {
    path: ["confirm"],
    message: "New passwords do not match.",
  })
  .refine((d) => d.next !== d.current, {
    path: ["next"],
    message: "New password must differ from the current one.",
  });

export async function changePassword(
  _prev: AccountFormState | undefined,
  formData: FormData,
): Promise<AccountFormState> {
  const admin = await requireAdmin();

  const parsed = passwordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  if (!(await verifyPassword(admin.email, parsed.data.current))) {
    return { error: "Your current password is incorrect." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.next });
  if (error) return { error: error.message };

  await audit(admin.email, "account.password_change", "Password changed");
  return { ok: true, message: "Password updated successfully." };
}

// ------------------------------------------------------------------- email
const emailSchema = z.object({
  current: z.string().min(1, "Enter your current password to confirm."),
  email: z
    .string()
    .email("Enter a valid email address.")
    .transform((v) => v.trim().toLowerCase()),
});

export async function changeLoginEmail(
  _prev: AccountFormState | undefined,
  formData: FormData,
): Promise<AccountFormState> {
  const admin = await requireAdmin();

  const parsed = emailSchema.safeParse({
    current: formData.get("current"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  if (parsed.data.email === admin.email.toLowerCase()) {
    return { error: "That is already your login email." };
  }
  if (!(await verifyPassword(admin.email, parsed.data.current))) {
    return { error: "Your current password is incorrect." };
  }

  // Service-role admin update: set the new email and mark it confirmed so the
  // owner can sign in with it immediately (no confirmation-email round trip,
  // which matters because the old inbox may be inaccessible).
  const db = createAdminClient();
  const { error } = await db.auth.admin.updateUserById(admin.id, {
    email: parsed.data.email,
    email_confirm: true,
  });
  if (error) {
    if (/already|registered|exists/i.test(error.message)) {
      return { error: "That email is already in use." };
    }
    return { error: error.message };
  }

  await audit(
    admin.email,
    "account.email_change",
    `Login email changed to ${parsed.data.email}`,
  );
  revalidatePath("/admin/account");
  return {
    ok: true,
    message: `Login email changed to ${parsed.data.email}. Use it next time you sign in.`,
  };
}

// ----------------------------------------------------------------- profile
const profileSchema = z.object({
  display_name: z.string().max(80).optional().transform((v) => (v ?? "").trim()),
});

export async function updateProfile(
  _prev: AccountFormState | undefined,
  formData: FormData,
): Promise<AccountFormState> {
  const admin = await requireAdmin();

  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
  });
  if (!parsed.success) return { error: "Invalid input." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    data: { display_name: parsed.data.display_name },
  });
  if (error) return { error: error.message };

  await audit(admin.email, "account.profile_update", "Profile updated");
  revalidatePath("/admin/account");
  return { ok: true, message: "Profile saved." };
}

// ---------------------------------------------------------------- sessions
/**
 * Revoke ALL sessions for this admin everywhere (global sign-out). Useful if a
 * device is lost. The current session is included, so the caller is logged out
 * on the next request and the middleware sends them to /admin/login.
 */
export async function signOutEverywhere(): Promise<AccountFormState> {
  const admin = await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.auth.admin.signOut(admin.id, "global");
  if (error) return { error: error.message };
  await audit(admin.email, "account.signout_all", "Signed out of all sessions");
  return { ok: true, message: "Signed out of all devices." };
}
