"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { FloatingContact } from "./floating-contact";
import { Preloader } from "./preloader";

type FloatingConfig = {
  showWhatsapp: boolean;
  showCall: boolean;
  whatsappHref: string;
  callHref: string;
};

/**
 * Renders the public site chrome (nav, footer, floating buttons, preloader).
 * Hidden on /admin so the dashboard stands alone. `floating` is owner-
 * configurable (Settings) and threaded down from the server layout.
 */
export function SiteChrome({
  children,
  footer,
  floating,
}: {
  children: React.ReactNode;
  /** Rendered on the server (async Footer reads settings) and slotted here. */
  footer: React.ReactNode;
  floating: FloatingConfig;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Preloader />
      <Navbar />
      <main className="flex-1">{children}</main>
      {footer}
      <FloatingContact
        showWhatsapp={floating.showWhatsapp}
        showCall={floating.showCall}
        whatsappHref={floating.whatsappHref}
        callHref={floating.callHref}
      />
    </>
  );
}
