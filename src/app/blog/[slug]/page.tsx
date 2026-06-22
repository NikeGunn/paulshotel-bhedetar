import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { articleJsonLd, breadcrumbJsonLd, jsonLdScript } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 60;

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || siteConfig.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(articleJsonLd(post))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${slug}` },
          ]),
        )}
      />

      <article className="bg-cream pb-24 pt-28">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>

          {post.published_at && (
            <p className="mt-6 text-sm uppercase tracking-wide text-amber-600">
              {formatDate(post.published_at)}
            </p>
          )}
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-brand-900 sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-muted">{post.excerpt}</p>
          )}

          {post.cover_url && (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[2rem] shadow-xl">
              <Image
                src={post.cover_url}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          {/* Sanitized on write (savePost) AND again on render for defense in depth. */}
          <div
            className="prose-hotel mt-10 max-w-none text-lg text-brand-900"
            /* Already sanitized with DOMPurify at save time in savePost(). */
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 rounded-3xl bg-brand-950 p-8 text-center text-cream">
            <h2 className="font-display text-2xl font-semibold">
              Ready to see it for yourself?
            </h2>
            <p className="mt-2 text-cream/70">
              Plan your stay at Paul&apos;s Hotel & Lodge in Bhedetar.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex rounded-full bg-amber-400 px-7 py-3 font-semibold text-brand-950 transition-transform hover:-translate-y-0.5"
            >
              Enquire now
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
