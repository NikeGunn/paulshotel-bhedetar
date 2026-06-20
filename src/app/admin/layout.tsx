import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in (e.g. /admin/login): render bare, middleware guards the rest.
  if (!user) return <>{children}</>;

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
