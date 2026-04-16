import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

const LAST_UPDATED = 'April 16, 2026'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mongilstardive.wiki'
  const path = '/privacy-policy'

  return {
    title: 'Privacy Policy - MONGIL STAR DIVE Wiki',
    description:
      'Read the Privacy Policy for MONGIL STAR DIVE Wiki and learn how analytics, cookies, and user preferences are handled.',
    keywords: [
      'privacy policy',
      'MONGIL STAR DIVE Wiki privacy',
      'data protection',
      'cookies policy',
      'analytics policy',
    ],
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'MONGIL STAR DIVE Wiki',
      title: 'Privacy Policy - MONGIL STAR DIVE Wiki',
      description: 'How MONGIL STAR DIVE Wiki collects and uses minimal data.',
      images: [
        {
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          alt: 'MONGIL STAR DIVE hero visual',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Privacy Policy - MONGIL STAR DIVE Wiki',
      description: 'How MONGIL STAR DIVE Wiki collects and uses minimal data.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300 text-lg mb-2">How we collect, use, and protect your information</p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Scope</h2>
            <p>
              This Privacy Policy explains how MONGIL STAR DIVE Wiki ("we", "our", or "us") handles information when
              you visit and use our fan-made resource website.
            </p>

            <h2>2. Data We Collect</h2>
            <ul>
              <li><strong>Usage analytics:</strong> page views, device type, browser, and approximate location.</li>
              <li><strong>Technical logs:</strong> performance and error diagnostics for reliability.</li>
              <li><strong>Preferences:</strong> language and theme settings stored in your browser.</li>
            </ul>
            <p>We do not intentionally collect sensitive personal data through normal browsing.</p>

            <h2>3. How We Use Data</h2>
            <ul>
              <li>Operate and improve MONGIL STAR DIVE Wiki.</li>
              <li>Measure content quality and identify popular guides.</li>
              <li>Prevent abuse and maintain platform security.</li>
            </ul>

            <h2>4. Cookies and Third-Party Services</h2>
            <p>
              We may use cookies and similar technologies for analytics, ad measurement, and preference storage. Third-party
              services may include Google Analytics, Microsoft Clarity, and advertising providers.
            </p>
            <p>
              You can manage cookies from your browser settings. Disabling cookies may affect site functionality.
            </p>

            <h2>5. External Links</h2>
            <p>
              This website links to third-party pages such as the official MONGIL: STAR DIVE website, Discord, X, YouTube,
              and other community resources. Their privacy practices are governed by their own policies.
            </p>

            <h2>6. Children&apos;s Privacy</h2>
            <p>
              We do not knowingly collect personal information from children under 13. If you believe a child submitted
              personal data to us, contact us and we will review and remove it where appropriate.
            </p>

            <h2>7. Policy Updates</h2>
            <p>
              We may update this policy from time to time. Any material changes will be reflected by updating the "Last
              Updated" date above.
            </p>

            <h2>8. Disclaimer</h2>
            <p>
              MONGIL STAR DIVE Wiki is an unofficial fan-made resource site and is not affiliated with, endorsed by, or
              associated with Netmarble.
            </p>

            <h2>9. Contact</h2>
            <p>For privacy questions or requests:</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@mongilstardive.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                privacy@mongilstardive.wiki
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
