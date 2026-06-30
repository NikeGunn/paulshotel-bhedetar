import { getPageTextValuesFresh } from "@/lib/page-text-data";
import { PageTextForm } from "@/components/admin/page-text-form";

export const dynamic = "force-dynamic";

export default async function AdminPageTextPage() {
  const values = await getPageTextValuesFresh();
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-brand-900">Page text</h1>
      <p className="mt-1 text-muted">
        Edit the headings and intro copy shown on each page. Leave a field as-is to keep the
        original wording. Changes appear on the live site within a minute.
      </p>
      <div className="mt-8">
        <PageTextForm values={values} />
      </div>
    </div>
  );
}
