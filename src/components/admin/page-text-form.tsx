"use client";

import { useActionState } from "react";
import { Loader2, Check, AlertCircle, Save } from "lucide-react";
import { savePageText, type PageTextFormState } from "@/app/actions/page-text";
import { PAGE_TEXT, type PageTextEntry } from "@/lib/page-text";

const field =
  "mt-1.5 w-full rounded-xl border border-brand-800/15 bg-white px-4 py-2.5 text-brand-900 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30";
const label = "text-sm font-medium text-brand-800";

/** Group registry entries by their `group` (page), preserving order. */
function grouped(): { group: string; items: PageTextEntry[] }[] {
  const out: { group: string; items: PageTextEntry[] }[] = [];
  for (const e of PAGE_TEXT) {
    let g = out.find((x) => x.group === e.group);
    if (!g) {
      g = { group: e.group, items: [] };
      out.push(g);
    }
    g.items.push(e);
  }
  return out;
}

export function PageTextForm({ values }: { values: Record<string, string> }) {
  const [state, action, pending] = useActionState<PageTextFormState, FormData>(savePageText, {});

  return (
    <form action={action} className="space-y-6">
      {grouped().map(({ group, items }) => (
        <section key={group} className="rounded-2xl border border-brand-800/10 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-brand-900">{group}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {items.map((e) => {
              // Show the owner's stored value if present, else the compiled default
              // (so the field is never blank and editing starts from real copy).
              const current = values[e.key] ?? e.default;
              return (
                <div key={e.key} className={e.multiline ? "sm:col-span-2" : ""}>
                  <label className={label} htmlFor={e.key}>
                    {e.field}
                  </label>
                  {e.multiline ? (
                    <textarea id={e.key} name={e.key} rows={3} defaultValue={current} className={field} />
                  ) : (
                    <input id={e.key} name={e.key} defaultValue={current} className={field} />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {state.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </p>
      )}
      {state.ok && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check className="h-4 w-4 shrink-0" /> Saved. Your site updates within a minute.
        </p>
      )}

      <div className="sticky bottom-4 flex justify-end" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-800 px-7 py-3 font-semibold text-cream shadow-lg transition-colors hover:bg-brand-900 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>
    </form>
  );
}
