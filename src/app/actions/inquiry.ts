"use server";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { inquirySchema, type InquiryInput, type InquiryResult } from "@/lib/inquiry-schema";
import { siteConfig } from "@/lib/site-config";

/**
 * Saves a guest enquiry to Supabase (service role, no CORS) and notifies the
 * owner by email. All server-side.
 */
export async function submitInquiry(input: InquiryInput): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid form" };
  }
  const d = parsed.data;

  const db = createAdminClient();
  const { error } = await db.from("inquiries").insert({
    name: d.name,
    email: d.email || null,
    phone: d.phone,
    check_in: d.checkIn || null,
    check_out: d.checkOut || null,
    guests: d.guests || null,
    message: d.message || null,
  });

  if (error) {
    console.error("[inquiry] db error:", error.message);
    return { ok: false, error: "Could not send right now. Please call or WhatsApp us." };
  }

  // Best-effort email notification (does not block success).
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Paul's Hotel Website <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL || siteConfig.email,
        subject: `New enquiry from ${d.name}`,
        text: [
          `Name: ${d.name}`,
          `Phone: ${d.phone}`,
          `Email: ${d.email || "-"}`,
          `Check in: ${d.checkIn || "-"}`,
          `Check out: ${d.checkOut || "-"}`,
          `Guests: ${d.guests || "-"}`,
          `Message: ${d.message || "-"}`,
        ].join("\n"),
      });
    } catch (e) {
      console.error("[inquiry] email failed:", e);
    }
  }

  return { ok: true };
}
