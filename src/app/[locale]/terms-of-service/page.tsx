import { Link } from '@/i18n/navigation'
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
  const path = '/terms-of-service'

  return {
    title: 'Terms of Service - MONGIL STAR DIVE Wiki',
    description:
      'Read the Terms of Service for MONGIL STAR DIVE Wiki, including acceptable use, content ownership, and legal limitations.',
    keywords: [
      'terms of service',
      'MONGIL STAR DIVE Wiki terms',
      'user agreement',
      'usage policy',
      'legal terms',
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
      title: 'Terms of Service - MONGIL STAR DIVE Wiki',
      description: 'Terms and conditions for using MONGIL STAR DIVE Wiki.',
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
      title: 'Terms of Service - MONGIL STAR DIVE Wiki',
      description: 'Terms and conditions for using MONGIL STAR DIVE Wiki.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-300 text-lg mb-2">Terms and conditions for using MONGIL STAR DIVE Wiki</p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using MONGIL STAR DIVE Wiki, you agree to these Terms of Service. If you do not agree,
              please do not use this website.
            </p>

            <h2>2. Service Description</h2>
            <p>
              MONGIL STAR DIVE Wiki is an unofficial fan-made resource website that provides guides, strategy notes,
              banner tracking references, and community information related to MONGIL: STAR DIVE.
            </p>
            <p>
              We are not affiliated with, endorsed by, or associated with Netmarble.
            </p>

            <h2>3. Acceptable Use</h2>
            <ul>
              <li>Do not use the website for unlawful activities.</li>
              <li>Do not attempt to disrupt, exploit, or abuse the platform.</li>
              <li>Do not scrape content at abusive rates or bypass technical protections.</li>
              <li>Do not impersonate our team or misrepresent affiliation.</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              Original text, data organization, and tools on this site are owned by MONGIL STAR DIVE Wiki unless
              otherwise stated. Game names, logos, and assets belong to their respective owners.
            </p>

            <h2>5. External Services</h2>
            <p>
              This website may link to third-party services (official website, Discord, X, YouTube, forums, and others).
              We are not responsible for the content, security, or practices of those services.
            </p>

            <h2>6. Disclaimer</h2>
            <p>
              Content is provided "as is" for informational purposes. We make reasonable efforts to keep information
              accurate, but game updates may make guides outdated.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, MONGIL STAR DIVE Wiki will not be liable for indirect,
              incidental, consequential, or special damages arising from the use of this website.
            </p>

            <h2>8. Changes</h2>
            <p>
              We may update these terms at any time. Changes take effect upon publication, and the latest revision date
              appears at the top of this page.
            </p>

            <h2>9. Contact</h2>
            <p>
              Questions about these terms can be sent to:{' '}
              <a href="mailto:legal@mongilstardive.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                legal@mongilstardive.wiki
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
