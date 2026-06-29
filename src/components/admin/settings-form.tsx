"use client";

import { useActionState } from "react";
import { Loader2, Check, Save, AlertCircle } from "lucide-react";
import { saveSettings, type SettingsFormState } from "@/app/actions/settings";
import type { ResolvedSettings } from "@/lib/settings";

const field =
  "mt-1.5 w-full rounded-xl border border-brand-800/15 bg-white px-4 py-2.5 text-brand-900 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30";
const label = "text-sm font-medium text-brand-800";

function Field({
  name,
  label: lbl,
  defaultValue,
  placeholder,
  type = "text",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className={label} htmlFor={name}>
        {lbl}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={field}
      />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-brand-800/10 bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-brand-900">{title}</h2>
      {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function SettingsForm({ settings }: { settings: ResolvedSettings }) {
  const [state, formAction, pending] = useActionState<
    SettingsFormState,
    FormData
  >(saveSettings, {});

  return (
    <form action={formAction} className="space-y-6">
      <Section
        title="Business information"
        desc="Name, contact details and address shown across the site and in search results."
      >
        <Field name="name" label="Hotel name" defaultValue={settings.name} />
        <Field name="tagline" label="Tagline" defaultValue={settings.tagline} />
        <div className="sm:col-span-2">
          <label className={label} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={settings.description}
            className={field}
          />
        </div>
        <Field name="phone" label="Phone (display)" defaultValue={settings.phone} />
        <Field
          name="phone_e164"
          label="Phone (E.164 for tel:/wa.me)"
          defaultValue={settings.phoneE164}
          placeholder="+9779701406587"
        />
        <Field
          name="whatsapp"
          label="WhatsApp number (no +)"
          defaultValue={settings.whatsapp}
          placeholder="9779701406587"
        />
        <Field
          name="email"
          label="Public contact email"
          type="email"
          defaultValue={settings.email}
          hint="Shown on the site (footer, contact page, JSON-LD)."
        />
        <Field name="hours" label="Hours" defaultValue={settings.hours} />
      </Section>

      <Section title="Address">
        <Field name="address_street" label="Street" defaultValue={settings.address.street} />
        <Field name="address_locality" label="Locality" defaultValue={settings.address.locality} />
        <Field name="address_region" label="Region / district" defaultValue={settings.address.region} />
        <Field name="address_postal_code" label="Postal code" defaultValue={settings.address.postalCode} />
        <Field name="address_country" label="Country" defaultValue={settings.address.country} />
        <Field name="address_full" label="Full address (one line)" defaultValue={settings.address.full} />
        <Field
          name="geo_lat"
          label="Latitude"
          type="number"
          defaultValue={settings.geo.lat}
          hint="Used for map / JSON-LD geo."
        />
        <Field name="geo_lng" label="Longitude" type="number" defaultValue={settings.geo.lng} />
      </Section>

      <Section title="Social & map">
        <Field name="facebook_url" label="Facebook URL" defaultValue={settings.social.facebook} />
        <Field name="instagram_url" label="Instagram URL" defaultValue={settings.social.instagram} />
        <Field name="directions_url" label="Google Maps directions URL" defaultValue={settings.directionsUrl} />
        <Field name="map_embed_query" label="Map embed search query" defaultValue={settings.mapEmbedQuery} />
      </Section>

      <Section
        title="Reputation & SEO"
        desc="Star rating, price tier and the keyword targets used in metadata."
      >
        <Field name="rating_value" label="Rating (0–5)" type="number" defaultValue={settings.rating.value} />
        <Field name="rating_count" label="Review count" type="number" defaultValue={settings.rating.count} />
        <Field name="price_range" label="Price range" defaultValue={settings.priceRange} placeholder="NPR 1,500-2,500" />
        <div className="sm:col-span-2">
          <label className={label} htmlFor="seo_keywords">
            SEO keywords
          </label>
          <textarea
            id="seo_keywords"
            name="seo_keywords"
            rows={3}
            defaultValue={settings.keywords.join(", ")}
            className={field}
          />
          <p className="mt-1 text-xs text-muted">Separate with commas or new lines.</p>
        </div>
      </Section>

      <Section
        title="Notifications & features"
        desc="Where new enquiry alerts are sent, and which floating contact buttons appear."
      >
        <Field
          name="notify_email"
          label="Enquiry alert email"
          type="email"
          defaultValue={settings.notifyEmail}
          hint="New enquiries are emailed here. (The OWNER_EMAIL env var takes priority on the live server.)"
        />
        <div className="sm:col-span-2 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_whatsapp_button"
              defaultChecked={settings.showWhatsappButton}
              className="h-4 w-4 rounded border-brand-800/30 text-brand-700 focus:ring-amber-400"
            />
            <span className="text-sm text-brand-800">Show floating WhatsApp button</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_call_button"
              defaultChecked={settings.showCallButton}
              className="h-4 w-4 rounded border-brand-800/30 text-brand-700 focus:ring-amber-400"
            />
            <span className="text-sm text-brand-800">Show floating Call button</span>
          </label>
        </div>
      </Section>

      {state.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {state.error}
        </p>
      )}
      {state.ok && (
        <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check className="h-4 w-4 shrink-0" /> Settings saved. Your site updates within a minute.
        </p>
      )}

      <div
        className="sticky bottom-4 flex justify-end"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-brand-800 px-7 py-3 font-semibold text-cream shadow-lg transition-colors hover:bg-brand-900 disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
