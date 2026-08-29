import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  allBlogPosts,
  CATEGORY_LABELS,
  getArticleContent,
  getBlogPostBySlug,
  getRelatedPhenotypes,
} from "@/lib/blogContent";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";

/**
 * SSG: 预渲染全部博客文章页。
 * dynamicParams = false：未在 generateStaticParams 返回列表中的 slug 直接 404。
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return allBlogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return buildMetadata({
      title: "Article Not Found | Ethnicity Guesser",
      description: "The requested blog article could not be found.",
      path: "/blog",
    });
  }
  // OG 图直接用文章配图（本地图，SSG 静态可访问）
  return buildMetadata({
    title: `${post.title} | ${SITE_NAME} Blog`,
    description: post.excerpt.slice(0, 160),
    path: `/blog/${post.slug}`,
    ogImage: `${SITE_URL}${post.image_url}`,
  });
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * /blog/[slug] 文章页（服务端组件 + SSG）。
 *
 * 哥飞 H 骨架：
 * - Disclaimer 在 H1 之前
 * - 单一 H1：文章标题；H2：各小节 / FAQ / Related Phenotypes
 * - Article JSON-LD + FAQPage JSON-LD + BreadcrumbList（Breadcrumbs 注入）
 * - 文末内链：相关 phenotype 卡 + Play CTA
 */
export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogPostBySlug(params.slug);
  const content = post ? getArticleContent(post.slug) : undefined;

  if (!post || !content) {
    return (
      <div className="flex flex-col gap-6">
        <Disclaimer />
        <h1 className="m-0 text-3xl font-bold text-stone-900">
          Article Not Found
        </h1>
        <p className="m-0 text-base text-stone-700">
          The requested blog article could not be found.
        </p>
        <Link
          href="/blog"
          className="text-stone-900 underline underline-offset-4 min-h-[44px] inline-flex items-center"
        >
          ← Back to the blog
        </Link>
      </div>
    );
  }

  const relatedPhenotypes = getRelatedPhenotypes(post);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: `${SITE_URL}${post.image_url}`,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  const faqJsonLd =
    content.faq && content.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <div className="flex flex-col gap-8">
      <Disclaimer />

      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ]}
      />

      <article className="flex flex-col gap-8 max-w-3xl rounded-4xl bg-white border border-stone-200 shadow-premium p-6 sm:p-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span className="px-2 py-0.5 rounded-full bg-section-soft border border-stone-200/70 font-medium text-stone-700">
              {CATEGORY_LABELS[post.category] || post.category}
            </span>
            <span>{formatDate(post.date)}</span>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            {post.title}
          </h1>
          <p className="m-0 text-base text-stone-600 leading-relaxed">
            {post.excerpt}
          </p>
          <Image
            src={post.image_url}
            alt={post.image_alt}
            width={300}
            height={300}
            sizes="(max-width: 640px) 100vw, 300px"
            className="rounded-3xl overflow-hidden shadow-premium object-cover bg-stone-100 w-full max-w-[300px] h-auto mt-2"
            priority
          />
        </header>

        {content.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="m-0 text-2xl font-bold text-stone-900">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="m-0 text-base text-stone-700 leading-relaxed"
              >
                {p}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="m-0 pl-6 list-disc flex flex-col gap-2 text-sm text-stone-700">
                {section.bullets.map((b, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {content.faq && content.faq.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-2xl font-bold text-stone-900">
              Frequently Asked Questions
            </h2>
            <dl className="m-0 flex flex-col gap-5">
              {content.faq.map((item) => (
                <div key={item.question} className="flex flex-col gap-1.5">
                  <dt className="m-0 text-base font-semibold text-stone-900">
                    {item.question}
                  </dt>
                  <dd className="m-0 text-sm text-stone-700 leading-relaxed">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {relatedPhenotypes.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="m-0 text-2xl font-bold text-stone-900">
              Related Phenotypes
            </h2>
            <p className="m-0 text-base text-stone-700 leading-relaxed">
              Faces from the encyclopedia that appear in this article.
              Open any entry for its full description, distribution, and
              references.
            </p>
            <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedPhenotypes.map((r) => (
                <li key={r.slug} className="m-0 p-0">
                  <div className="group flex flex-col gap-1 p-3 h-full rounded-2xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ease-premium">
                    <h3 className="m-0 text-base font-semibold text-stone-900 leading-tight group-hover:text-amber-800 transition-colors">
                      <Link
                        href={`/phenotype/${r.slug}`}
                        className="hover:underline underline-offset-4 min-h-[44px] flex items-center"
                      >
                        {r.name}
                      </Link>
                    </h3>
                    <p className="m-0 text-xs text-stone-600">{r.region}</p>
                    <p className="m-0 text-xs text-stone-600 line-clamp-2">
                      {r.description
                        .split("Physical Traits:")[0]
                        .trim()
                        .slice(0, 140)}
                      {r.description.split("Physical Traits:")[0].trim().length >
                      140
                        ? "..."
                        : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-3 p-5 rounded-2xl bg-section-soft border border-stone-200/70">
          <h2 className="m-0 text-lg font-bold text-stone-900">
            Test what you learned
          </h2>
          <p className="m-0 text-sm text-stone-700 leading-relaxed">
            Put your eye for regional faces to work in the daily quiz — a
            composite face, a world map, and your best guess.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/play/classic-daily"
              className="inline-flex items-center min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-stone-900 rounded-full shadow-premium hover:bg-stone-800 hover:shadow-premium-hover active:scale-[0.98] transition-all duration-300 ease-premium"
            >
              Play Classic Daily
            </Link>
            <Link
              href="/phenotypes"
              className="inline-flex items-center min-h-[44px] px-5 py-2 text-sm font-medium text-stone-900 bg-white border border-stone-200 rounded-full shadow-premium hover:bg-stone-50 hover:shadow-premium-hover active:scale-[0.98] transition-all duration-300 ease-premium"
            >
              Browse Phenotypes
            </Link>
          </div>
        </section>

        <nav
          aria-label="Back to blog"
          className="border-t border-stone-200 pt-4"
        >
          <Link
            href="/blog"
            className="text-stone-900 underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800 transition-colors min-h-[44px] inline-flex items-center text-sm"
          >
            ← Back to the blog
          </Link>
        </nav>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </div>
  );
}
