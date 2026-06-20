import { Phone, Mail } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { LeadStatus } from "@/components/admin/lead-status";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const db = createAdminClient();
  const { data: leads } = await db
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brand-900">Enquiries</h1>
      <p className="mt-1 text-muted">Guest booking requests from your website.</p>

      <div className="mt-8 space-y-4">
        {!leads || leads.length === 0 ? (
          <div className="rounded-2xl border border-brand-800/10 bg-white p-10 text-center text-muted">
            No enquiries yet. They will appear here as guests reach out.
          </div>
        ) : (
          leads.map((l) => (
            <div
              key={l.id}
              className="rounded-2xl border border-brand-800/10 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-semibold text-brand-900">
                      {l.name}
                    </h3>
                    <LeadStatus id={l.id} status={l.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    <a href={`tel:${l.phone}`} className="inline-flex items-center gap-1.5 hover:text-brand-600">
                      <Phone className="h-3.5 w-3.5" /> {l.phone}
                    </a>
                    {l.email && (
                      <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 hover:text-brand-600">
                        <Mail className="h-3.5 w-3.5" /> {l.email}
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted">{formatDate(l.created_at)}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                {l.check_in && (
                  <span className="text-muted">
                    Check in: <span className="text-brand-800">{l.check_in}</span>
                  </span>
                )}
                {l.check_out && (
                  <span className="text-muted">
                    Check out: <span className="text-brand-800">{l.check_out}</span>
                  </span>
                )}
                {l.guests && (
                  <span className="text-muted">
                    Guests: <span className="text-brand-800">{l.guests}</span>
                  </span>
                )}
              </div>

              {l.message && (
                <p className="mt-3 rounded-xl bg-sand/60 p-3 text-sm text-brand-900">
                  {l.message}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
