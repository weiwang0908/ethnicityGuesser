import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  allBlogPosts,
  CATEGORY_LABELS,
} from "@/lib/blogContent";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

/**
 * /blog 列表页（SSG，静态路由）。
 *
 * 哥飞 H 骨架：
 * - 单一 H1：Anthropology Blog — Phenotypes, Faces & Human Diversity
 * - H2 无（列表卡片用 H3）
 * - 面包屑 Home → Blog
 * - 空态：文案 + 返回首页 CTA（不出现建设中/占位样式，ADS-CONTENT-04）
 */
export const metadata: Metadata = buildMetadata({
  title: "Anthropology Blog - Phenotypes, Faces & Human Diversity",
  description:
    "Essays on human phenotypes, face variation, and the genetics behind them: why northern Europeans have light eyes, what a phenotype really is, and how to read human diversity honestly.",
  path: "/blog",
});

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogListPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ]}
      />

      <div className="flex flex-col gap-3 max-w-3xl">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          Blog
        </span>
        <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Anthropology Blog — Phenotypes, Faces &amp; Human Diversity
        </h1>
        <p className="m-0 text-base text-stone-600 leading-relaxed">
          Essays on the science behind the game: how phenotypes were
          documented, why faces vary across regions, and what genetics says
          about human diversity. New articles are added regularly.
        </p>
      </div>

      {allBlogPosts.length === 0 ? (
        <div className="rounded-4xl bg-white border border-stone-200 shadow-premium p-8 flex flex-col items-center text-center gap-4">
          <p className="m-0 text-base text-stone-700">
            No articles have been published yet. New essays on phenotypes
            and human variation are on the way.
          </p>
          <Link
            href="/"
            className="inline-flex items-center min-h-[44px] px-5 py-2 text-sm font-medium text-white bg-stone-900 rounded-full shadow-premium hover:bg-stone-800 active:scale-[0.98] transition-all duration-300 ease-premium"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <ul className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {allBlogPosts.map((post) => (
            <li key={post.slug} className="m-0 p-0">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 h-full p-5 rounded-3xl bg-white border border-stone-200 shadow-premium hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 ease-premium"
              >
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="px-2 py-0.5 rounded-full bg-section-soft border border-stone-200/70 font-medium text-stone-700">
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  <span>{formatDate(post.date)}</span>
                  <span aria-hidden>·</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <h2 className="m-0 text-xl font-semibold text-stone-900 leading-snug group-hover:text-amber-800 transition-colors">
                  {post.title}
                </h2>
                <p className="m-0 text-sm text-stone-600 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-3 pt-1">
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <Image
                      src={post.image_url}
                      alt={post.image_alt}
                      fill
                      sizes="64px"
                      className="object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-premium"
                    />
                  </div>
                  <span className="text-sm font-medium text-stone-900 group-hover:text-amber-800 group-hover:translate-x-1 transition-all duration-300 ease-premium">
                    Read article →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
