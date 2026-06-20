"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { FloatingContact } from "./floating-contact";
import { Preloader } from "./preloader";

/**
 * Renders the public site chrome (nav, footer, floating buttons, preloader).
 * Hidden on /admin so the dashboard stands alone.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Preloader />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
    </>
  );
}
