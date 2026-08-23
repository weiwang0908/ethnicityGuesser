import Link from "next/link";
import { buildMetadata, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Privacy Policy for Ethnicity Guesser. We use cookie-free Plausible Analytics, store no personal data, and never store uploaded photos. GDPR and CCPA compliant by design.",
  path: "/privacy-policy",
});

/**
 * /privacy-policy 信任页（服务端组件 + SSG）。
 * 哥飞方法论：单一 H1，H2 罗列章节，正文写在 <p>，无 keywords meta。
 * 重点：Plausible（无 cookie）、不存储用户上传照片、GDPR/CCPA 合规意向。
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col gap-8">
      <Breadcrumbs
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Privacy Policy", url: `${SITE_URL}/privacy-policy` },
        ]}
      />

      <article className="flex flex-col gap-6 max-w-3xl rounded-4xl bg-section-soft border border-stone-200/70 p-6 sm:p-8 shadow-premium">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">
          Privacy
        </span>
        <h1 className="m-0 text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
          Privacy Policy
        </h1>

        <p className="m-0 text-base text-stone-700 leading-relaxed">
          This Privacy Policy explains what information Ethnicity Guesser
          collects, how we use it, and the choices you have. We designed the
          site to collect as little as possible, to avoid cookies, and to keep
          the game playable without any account. This policy may be updated
          from time to time; the effective date is the date you load this
          page.
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Information We Collect
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser is a static, no-login website. We do not ask for
            your name, email address, password, or any other account
            information, because there is no account. We do not run a backend
            that records your game answers or quiz scores. Your daily streak
            and any local game progress are stored only in your own browser
            through localStorage, and they never leave your device. Clearing
            your browser data erases this information completely, with no
            backup on our side.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            The only information we receive automatically is the minimal
            anonymized traffic data described in the Cookies &amp; Analytics
            section below. We do not buy, sell, or trade any personal data,
            because we do not have any personal data to begin with.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Cookies &amp; Analytics
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Ethnicity Guesser uses{" "}
            <a
              href="https://plausible.io"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
              rel="noopener noreferrer"
              target="_blank"
            >
              Plausible Analytics
            </a>{" "}
            for privacy-friendly, cookie-free traffic measurement. Plausible
            does not use cookies, does not collect personally identifiable
            information, does not track you across other websites, and does
            not build a behavioral profile of any visitor. The data it
            collects is limited to aggregate counts: total page views, rough
            country (derived from IP at request time and never stored), the
            referring website, and the page you loaded. There is no user ID,
            no fingerprint, and no cross-site tracking.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Because Plausible is cookie-free, this site does not set any
            tracking cookies and does not require a cookie banner under the
            EU ePrivacy Directive. If you still prefer to opt out of all
            analytics, you can use a content blocker or do-not-track setting
            in your browser; Plausible respects Do Not Track signals.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Third-Party Services
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Static site assets (composite face images and phenotype
            photographs) may be loaded from public CDN-hosted archives such as
            the Human Phenotypes reference site, Wikimedia Commons, and
            placeholder image services during development. When you load a
            page that references an external image, your browser fetches it
            directly from that third-party host, and the host may record a
            request in its own logs. We do not control these logs and we do
            not receive any data from them. We deliberately avoid third-party
            advertising networks, social-media embeds, and comment widgets,
            because each of those would bring its own tracker.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            We do not embed any third-party login, payment, or chat widget. If
            we ever add a feature that requires one, we will update this
            policy first and name the provider and the data it receives.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">
            Data Retention
          </h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Because we do not store personal data, there is essentially nothing
            to retain. Aggregate analytics counters in Plausible are retained
            by Plausible according to its own data-retention policy, which you
            can read on the Plausible website. Any game progress stored in
            your browser through localStorage persists only until you clear
            your browser data for this site, at which point it is permanently
            deleted.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            We do not store uploaded photos. Although the planned AI face
            analysis tool has been deferred, we want to be explicit: any
            future photo feature will be designed so that uploaded images are
            processed transiently and never persisted on our servers. If that
            design changes, this policy will be updated before the feature
            ships.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Your Rights</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            If you are located in the European Economic Area, the United
            Kingdom, or another jurisdiction with GDPR-style data protection
            law, you have rights including access, rectification, erasure,
            restriction, portability, and objection. Because we do not collect
            personal data tied to you, most of these rights are already
            satisfied by design: there is no profile to access, rectify, or
            port, and clearing your browser data fully erases your local game
            progress. For any request that does apply, contact us through the{" "}
            <Link
              href="/contact"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              Contact
            </Link>{" "}
            page.
          </p>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            If you are a California resident, the California Consumer Privacy
            Act (CCPA) gives you the right to know what personal information is
            collected, to request deletion, and to opt out of the sale or
            sharing of personal information. We do not sell or share personal
            information, and we collect none beyond the aggregate analytics
            described above, so there is nothing to opt out of beyond what a
            content blocker already provides. This policy reflects our
            good-faith effort to comply with GDPR and CCPA; it is not legal
            advice and does not create any contractual right beyond those
            provided by law.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="m-0 text-2xl font-bold text-stone-900">Contact</h2>
          <p className="m-0 text-base text-stone-700 leading-relaxed">
            Questions about this Privacy Policy can be sent to{" "}
            <a
              href="mailto:hello@ethnicity-guesser.com"
              className="text-stone-900 font-medium underline underline-offset-4 decoration-stone-300 hover:decoration-amber-500 hover:text-amber-800"
            >
              hello@ethnicity-guesser.com
            </a>
            . For any formal data-protection request, please include
            &quot;Privacy Request&quot; in the subject line so we can route it
            correctly.
          </p>
        </section>
      </article>
    </div>
  );
}
