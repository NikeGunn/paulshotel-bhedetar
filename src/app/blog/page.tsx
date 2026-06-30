import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PenLine, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { getPageText } from "@/lib/page-text-data";

export const metadata: Metadata = {
  title: "Blog & Travel Notes",
  description:
    "Stories, tips and travel notes from Paul's Hotel & Lodge in Bhedetar. Sunrise spots, what to eat, the best time to visit and more.",
  alternates: { canonical: "/blog" },
};

// Revalidate so new admin posts appear without a redeploy.
export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, cover_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const pt = await getPageText();

  return (
    <>
      <PageHero
        crumb="Blog"
        kicker={pt("blog.hero.kicker")}
        title={pt("blog.hero.title")}
        intro={pt("blog.hero.intro")}
        image="/images/views/night-sky-stars.webp"
        alt="Starry night sky over Bhedetar"
      />
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          {!posts || posts.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-brand-800/20 bg-white p-12 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-700">
                <PenLine className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold text-brand-900">
                New posts on the way
              </h2>
              <p className="mt-2 text-muted">
                We are writing up our favourite sunrise spots, what to eat and the
                best times to visit. Check back soon.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex rounded-full bg-amber-400 px-6 py-3 font-semibold text-brand-950 transition-transform hover:-translate-y-0.5"
              >
                Plan your visit
              </Link>
            </div>
          ) : (
            <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <StaggerItem key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group block h-full overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-brand-100">
                      {p.cover_url && (
                        <Image
                          src={p.cover_url}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      {p.published_at && (
                        <p className="text-xs uppercase tracking-wide text-amber-600">
                          {formatDate(p.published_at)}
                        </p>
                      )}
                      <h3 className="mt-2 font-display text-xl font-semibold text-brand-900">
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm text-muted">{p.excerpt}</p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                        Read more <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
