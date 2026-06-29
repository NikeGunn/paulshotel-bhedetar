import type { Metadata } from "next";
import { getSettingsFresh } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

// Always render the live row so a save is reflected immediately.
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettingsFresh();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-semibold text-brand-900">Settings</h1>
      <p className="mt-1 text-muted">
        Manage your business details, SEO and site features. Changes are safe —
        any field left blank falls back to the built-in default.
      </p>

      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
