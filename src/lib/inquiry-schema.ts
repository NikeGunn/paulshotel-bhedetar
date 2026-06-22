import { z } from "zod";

/** Today's date as a YYYY-MM-DD string in local time (matches <input type="date">). */
export function todayISO(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

// Accept an empty string (field optional) or a real YYYY-MM-DD date.
const dateField = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
  .or(z.literal(""))
  .optional();

export const inquirySchema = z
  .object({
    name: z.string().min(2, "Please tell us your name"),
    email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
    phone: z.string().min(6, "Enter a contact number"),
    checkIn: dateField,
    checkOut: dateField,
    guests: z.string().optional(),
    message: z.string().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    const today = todayISO();

    // Check-in cannot be in the past. (String compare is safe for YYYY-MM-DD.)
    if (data.checkIn && data.checkIn < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkIn"],
        message: "Check-in cannot be in the past.",
      });
    }

    // Check-out cannot be in the past.
    if (data.checkOut && data.checkOut < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out cannot be in the past.",
      });
    }

    // Check-out must be strictly after check-in (no same-day / reversed stays).
    if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out must be after check-in.",
      });
    }
  });

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryResult = { ok: boolean; error?: string };
