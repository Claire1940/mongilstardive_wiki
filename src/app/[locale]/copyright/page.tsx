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
  const path = '/copyright'

  return {
    title: 'Copyright Notice - MONGIL STAR DIVE Wiki',
    description:
      'Copyright and intellectual property policy for MONGIL STAR DIVE Wiki, including fair use and DMCA reporting.',
    keywords: [
      'copyright notice',
      'MONGIL STAR DIVE Wiki copyright',
      'DMCA',
      'fair use',
      'intellectual property',
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
      title: 'Copyright Notice - MONGIL STAR DIVE Wiki',
      description: 'Copyright, DMCA, and fair use information for MONGIL STAR DIVE Wiki.',
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
      title: 'Copyright Notice - MONGIL STAR DIVE Wiki',
      description: 'Copyright, DMCA, and fair use information for MONGIL STAR DIVE Wiki.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function Copyright() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Copyright Notice</h1>
          <p className="text-slate-300 text-lg mb-2">Intellectual property rights and usage terms</p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Website Content Ownership</h2>
            <p>© 2026 MONGIL STAR DIVE Wiki. All rights reserved unless otherwise noted.</p>
            <p>
              Original guides, editorial content, data summaries, and page layouts published on this site are protected
              by copyright law.
            </p>

            <h2>2. Game Assets and Trademarks</h2>
            <p>
              MONGIL STAR DIVE Wiki is an unofficial fan-made resource website and is not affiliated with Netmarble.
              MONGIL: STAR DIVE names, logos, and game assets belong to their respective owners.
            </p>

            <h2>3. Fair Use</h2>
            <p>
              We may reference game-related media for commentary, educational guidance, and community information under
              fair use principles where applicable.
            </p>

            <h2>4. User Contributions</h2>
            <p>
              By submitting suggestions, corrections, or content, you confirm you have rights to that material and grant
              us permission to display and adapt it for website operations.
            </p>

            <h2>5. DMCA and Copyright Claims</h2>
            <p>
              If you believe content on this website infringes your copyright, send a detailed claim with ownership
              evidence and the exact URLs involved.
            </p>
            <p>
              <strong>DMCA Contact:</strong>{' '}
              <a href="mailto:dmca@mongilstardive.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                dmca@mongilstardive.wiki
              </a>
            </p>

            <h2>6. Attribution</h2>
            <p>
              If you quote our original material, please provide attribution and a link to the source page.
            </p>

            <h2>7. Contact</h2>
            <p>
              General copyright or licensing inquiries:{' '}
              <a href="mailto:copyright@mongilstardive.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                copyright@mongilstardive.wiki
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
