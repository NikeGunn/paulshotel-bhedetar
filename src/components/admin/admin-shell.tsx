"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Images, Inbox, Settings, UserCog, LogOut, ExternalLink, LayoutGrid, Type } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/content", label: "Content", icon: LayoutGrid },
  { href: "/admin/page-text", label: "Page text", icon: Type },
  { href: "/admin/blog", label: "Blog posts", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/leads", label: "Enquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/account", label: "Account", icon: UserCog },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-sand">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-brand-800/10 bg-brand-950 p-5 text-cream lg:flex">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400 font-display text-lg font-bold text-brand-950">
            P
          </span>
          <span className="font-display text-lg font-semibold">Paul&apos;s Admin</span>
        </Link>

        <nav className="mt-8 flex-1 space-y-1">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-cream/10 text-amber-200"
                    : "text-cream/70 hover:bg-cream/5 hover:text-cream",
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-cream/10 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 text-xs text-cream/60 hover:text-amber-200"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View live site
          </Link>
          <p className="truncate px-4 text-xs text-cream/40">{email}</p>
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-cream/70 transition-colors hover:bg-red-500/15 hover:text-red-300"
            >
              <LogOut className="h-4.5 w-4.5" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-brand-800/10 bg-brand-950 px-5 py-3 text-cream lg:hidden">
          <span className="font-display font-semibold">Paul&apos;s Admin</span>
          <form action={signOut}>
            <button className="text-sm text-cream/70">Sign out</button>
          </form>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-brand-800/10 bg-brand-900 px-3 py-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-cream/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
