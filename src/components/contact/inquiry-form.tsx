"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { Loader2, Check, Send } from "lucide-react";
import { inquirySchema, todayISO, type InquiryInput } from "@/lib/inquiry-schema";
import { submitInquiry } from "@/app/actions/inquiry";

export function InquiryForm() {
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({ resolver: zodResolver(inquirySchema) });

  const today = todayISO();
  const checkIn = watch("checkIn");

  async function onSubmit(data: InquiryInput) {
    setServerError(null);
    const res = await submitInquiry(data);
    if (res.ok) setDone(true);
    else setServerError(res.error ?? "Something went wrong. Please call us instead.");
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl bg-white p-10 text-center shadow-sm"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-amber-600">
          <Check className="h-8 w-8" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-semibold text-brand-900">
          Thank you, we will be in touch
        </h3>
        <p className="mt-2 text-muted">
          We have received your enquiry and will reply soon. For anything urgent,
          please call or WhatsApp us directly.
        </p>
      </motion.div>
    );
  }

  const field =
    "mt-1.5 w-full rounded-xl border border-brand-800/15 bg-white px-4 py-3 text-brand-900 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30";
  const label = "text-sm font-medium text-brand-800";
  const err = "mt-1 text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label}>Your name *</label>
          <input className={field} placeholder="e.g. Sujan Rai" {...register("name")} />
          {errors.name && <p className={err}>{errors.name.message}</p>}
        </div>
        <div>
          <label className={label}>Phone *</label>
          <input className={field} placeholder="98XXXXXXXX" {...register("phone")} />
          {errors.phone && <p className={err}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={label}>Email</label>
          <input className={field} placeholder="you@email.com" {...register("email")} />
          {errors.email && <p className={err}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={label}>Check in</label>
          <input type="date" min={today} className={field} {...register("checkIn")} />
          {errors.checkIn && <p className={err}>{errors.checkIn.message}</p>}
        </div>
        <div>
          <label className={label}>Check out</label>
          <input
            type="date"
            min={checkIn || today}
            className={field}
            {...register("checkOut")}
          />
          {errors.checkOut && <p className={err}>{errors.checkOut.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Guests</label>
          <select className={field} defaultValue="2" {...register("guests")}>
            <option value="1">1 guest</option>
            <option value="2">2 guests</option>
            <option value="3">3 guests</option>
            <option value="4">4 guests</option>
            <option value="5+">5 or more</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={label}>Message</label>
          <textarea
            rows={4}
            className={field}
            placeholder="Tell us your plans, dates or any questions."
            {...register("message")}
          />
        </div>
      </div>

      {serverError && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-800 px-6 py-3.5 font-semibold text-cream transition-all hover:bg-brand-900 disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending
          </>
        ) : (
          <>
            Send enquiry <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
