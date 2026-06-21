"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    // Sign in with the browser client so the auth cookie is written client-side
    // (via @supabase/ssr), then navigate. middleware reads the same cookie and
    // lets us into /admin. This avoids the server-action cookie+redirect race.
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Incorrect email or password.");
      setPending(false);
      return;
    }

    router.refresh();
    router.replace("/admin");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-brand-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-400 font-display text-2xl font-bold text-brand-950">
            P
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-cream">
            Paul&apos;s Hotel Admin
          </h1>
          <p className="mt-1 text-sm text-cream/60">Sign in to manage your site</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl bg-cream p-7 shadow-2xl">
          <label className="text-sm font-medium text-brand-800">Email</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1.5 w-full rounded-xl border border-brand-800/15 px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
            placeholder="paulshotelbhedetar@gmail.com"
          />

          <label className="mt-4 block text-sm font-medium text-brand-800">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-xl border border-brand-800/15 px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
            placeholder="••••••••"
          />

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-800 px-6 py-3 font-semibold text-cream transition-colors hover:bg-brand-900 disabled:opacity-60"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Signing in
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Sign in
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
