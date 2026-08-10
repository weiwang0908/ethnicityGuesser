import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * 面包屑组件：可视化面包屑 + JSON-LD BreadcrumbList schema。
 *
 * - 可视部分用 ">" 分隔，最后一项不可点（当前页）。
 * - JSON-LD `<script type="application/ld+json">` 始终注入（移动端隐藏可视部分时仍保留）。
 * - 移动端（< sm）隐藏可视面包屑省空间，但 JSON-LD 保留供搜索引擎读取。
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="hidden sm:flex flex-wrap items-center gap-1 text-sm text-gray-600 m-0 p-0 list-none">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1 m-0 p-0">
              {isLast ? (
                <span aria-current="page" className="text-gray-900 font-medium">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:underline min-h-[44px] flex items-center"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden className="text-gray-400 mx-1">
                  &gt;
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
