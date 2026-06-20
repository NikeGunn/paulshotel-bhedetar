import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client. Only for auth-session UI in the admin login flow.
 * No privileged operations run here. All data writes go through server actions.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
