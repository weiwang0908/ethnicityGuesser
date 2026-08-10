"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const playLinks = [
  { name: "Classic Daily", href: "/play/classic-daily" },
  { name: "Challenge", href: "/play/challenge" },
  { name: "Countries", href: "/play/countries" },
];

const topLinks = [
  { name: "Phenotypes", href: "/phenotypes" },
  { name: "Countries", href: "/country" },
  { name: "FAQ", href: "/faq" },
];

/**
 * 全站顶部 Header（客户端组件，因移动端汉堡菜单需交互）。
 *
 * - 桌面端（≥ md）：水平导航，Play 用 CSS hover 下拉
 * - 移动端（< md）：汉堡按钮，点击展开抽屉式导航
 * - 导航链接均用 Next.js <Link>，不用 button 替代
 * - 所有可点击元素 ≥44×44px
 * - sticky 定位，不遮挡下方内容
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // 路由切换时（点击链接后）关闭移动菜单；同时锁 body 滚动
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobile}
            className="font-bold text-lg text-gray-900 min-h-[44px] flex items-center whitespace-nowrap"
          >
            Ethnicity Guesser
          </Link>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {/* Play 下拉（纯 CSS hover） */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded min-h-[44px] flex items-center gap-1"
                aria-haspopup="true"
              >
                Play <span aria-hidden className="text-xs">▾</span>
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 transition-opacity absolute left-0 top-full bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[180px]">
                {playLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 min-h-[44px] flex items-center"
                  >
                    {l.name}
                  </Link>
                ))}
              </div>
            </div>
            {topLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded min-h-[44px] flex items-center"
              >
                {l.name}
              </Link>
            ))}
          </nav>

          {/* 移动端汉堡按钮 */}
          <button
            type="button"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded hover:bg-gray-100 text-gray-700"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span aria-hidden className="text-xl leading-none">
              {mobileOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* 移动端抽屉导航 */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden border-t border-gray-200 bg-white"
          aria-label="Mobile"
        >
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col">
            <div className="py-1">
              <div className="text-xs uppercase tracking-wide text-gray-500 px-2 py-1">
                Play
              </div>
              {playLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMobile}
                  className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded min-h-[44px] flex items-center"
                >
                  {l.name}
                </Link>
              ))}
            </div>
            <div className="py-1 border-t border-gray-100">
              {topLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={closeMobile}
                  className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded min-h-[44px] flex items-center"
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
