import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Please tell us your name"),
  email: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  phone: z.string().min(6, "Enter a contact number"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type InquiryResult = { ok: boolean; error?: string };
