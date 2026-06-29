import type { Metadata } from "next";
import { History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, recentAudit } from "@/lib/admin-auth";
import {
  ProfileCard,
  PasswordCard,
  EmailCard,
  SessionsCard,
} from "@/components/admin/account-forms";

export const metadata: Metadata = {
  title: "Account & Security",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Human label for an audit action code. */
const ACTION_LABEL: Record<string, string> = {
  "settings.update": "Updated site settings",
  "account.password_change": "Changed password",
  "account.email_change": "Changed login email",
  "account.profile_update": "Updated profile",
  "account.signout_all": "Signed out of all devices",
};

export default async function AdminAccountPage() {
  await requireAdmin();

  // Read the live user (for display name + email) via the session client.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email ?? "";
  const displayName = (user?.user_metadata?.display_name as string) ?? "";

  const audit = await recentAudit(20);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-brand-900">
        Account &amp; Security
      </h1>
      <p className="mt-1 text-muted">Manage your sign-in details and review recent activity.</p>

      <div className="mt-8 space-y-6">
        <ProfileCard displayName={displayName} />
        <PasswordCard />
        <EmailCard currentEmail={email} />
        <SessionsCard />

        {/* Activity log */}
        <section className="rounded-2xl border border-brand-800/10 bg-white p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <History className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-brand-900">
                Recent activity
              </h2>
              <p className="text-sm text-muted">The last 20 admin actions.</p>
            </div>
          </div>

          {audit.length === 0 ? (
            <p className="mt-5 text-sm text-muted">No activity recorded yet.</p>
          ) : (
            <ul className="mt-5 divide-y divide-brand-800/5">
              {audit.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-brand-800">
                    {ACTION_LABEL[a.action] ?? a.detail ?? a.action}
                  </span>
                  <time className="shrink-0 text-xs text-muted" dateTime={a.created_at}>
                    {new Date(a.created_at).toLocaleString("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
