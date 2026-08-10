import Link from "next/link";
import { SITE_DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/seo";

const gameLinks = [
  { name: "Classic Daily", href: "/play/classic-daily" },
  { name: "Challenge", href: "/play/challenge" },
  { name: "Countries", href: "/play/countries" },
];

const resourceLinks = [
  { name: "Phenotypes", href: "/phenotypes" },
  { name: "Countries", href: "/country" },
  { name: "FAQ", href: "/faq" },
];

const trustLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms", href: "/terms" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Editorial Policy", href: "/editorial-policy" },
];

/**
 * 全站 Footer（spec 要求三列 + 底部信任页链接行）。
 * 移动端（< md）三列变一列竖排。
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto w-full border-t border-gray-200 bg-gray-50 text-gray-700">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 第一列：品牌 + 简介 + 全站 disclaimer */}
          <div>
            <div className="font-semibold text-gray-900 text-lg">
              {SITE_NAME}
            </div>
            <p className="mt-2 text-sm leading-6 m-0">
              A free daily ethnicity quiz game. Guess ethnicity by face on the
              world map and browse human phenotypes with face features and
              origins.
            </p>
            <p className="mt-3 text-xs leading-5 text-gray-600 m-0 italic">
              {SITE_DISCLAIMER}
            </p>
          </div>

          {/* 第二列：Games */}
          <nav aria-label="Footer Games" className="flex flex-col gap-2">
            <div className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Games
            </div>
            {gameLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm hover:underline min-h-[44px] flex items-center"
              >
                {l.name}
              </Link>
            ))}
          </nav>

          {/* 第三列：Resources */}
          <nav aria-label="Footer Resources" className="flex flex-col gap-2">
            <div className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Resources
            </div>
            {resourceLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm hover:underline min-h-[44px] flex items-center"
              >
                {l.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* 底部信任页链接 */}
        <nav
          aria-label="Trust pages"
          className="mt-8 pt-4 border-t border-gray-200 flex flex-wrap gap-x-4 gap-y-2"
        >
          {trustLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs hover:underline min-h-[44px] flex items-center"
            >
              {l.name}
            </Link>
          ))}
        </nav>

        <div className="mt-6 text-xs text-gray-500">
          © {year} {SITE_NAME}.{" "}
          <a
            href={SITE_URL}
            className="hover:underline"
          >
            {SITE_URL.replace(/^https?:\/\//, "")}
          </a>
        </div>
      </div>
    </footer>
  );
}
