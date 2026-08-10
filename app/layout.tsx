import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/**
 * 站点级默认 metadata（哥飞 TDH 方法论）。
 * - 不生成 <meta name="keywords">
 * - metadataBase 让相对 OG 图地址可解析
 * - 不显式设置 openGraph.images，由 colocated app/opengraph-image.tsx
 *   （next/og ImageResponse）自动生成并注入；子路由未覆盖时继承首页 OG 图
 * - 单页 metadata 可通过 buildMetadata() 覆盖
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Daily Ethnicity Quiz & Phenotypes Game`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Play Ethnicity Guesser, a free daily ethnicity quiz game. Guess ethnicity by face on the world map, browse human phenotypes with face features and origins.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} - Daily Ethnicity Quiz & Phenotypes Game`,
    description:
      "Play Ethnicity Guesser, a free daily ethnicity quiz game. Guess ethnicity by face on the world map, browse human phenotypes with face features and origins.",
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Daily Ethnicity Quiz & Phenotypes Game`,
    description:
      "Play Ethnicity Guesser, a free daily ethnicity quiz game. Guess ethnicity by face on the world map, browse human phenotypes with face features and origins.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 w-full mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
        <Footer />
        <Script
          src={process.env.NEXT_PUBLIC_PLAUSIBLE_SRC}
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
