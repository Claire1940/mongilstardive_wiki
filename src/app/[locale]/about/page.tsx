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
  const path = '/about'

  return {
    title: 'About MONGIL STAR DIVE Wiki',
    description:
      'Learn about MONGIL STAR DIVE Wiki, a fan-maintained resource hub for reroll strategy, banners, characters, and progression guides.',
    keywords: [
      'about MONGIL STAR DIVE Wiki',
      'MONGIL STAR DIVE community',
      'MONGIL STAR DIVE guides',
      'fan wiki',
      'Netmarble RPG resource',
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
      title: 'About MONGIL STAR DIVE Wiki',
      description: 'Community-driven wiki project for MONGIL: STAR DIVE players.',
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
      title: 'About MONGIL STAR DIVE Wiki',
      description: 'Community-driven wiki project for MONGIL: STAR DIVE players.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About MONGIL STAR DIVE Wiki</h1>
          <p className="text-slate-300 text-lg mb-2">A fan-maintained strategy and reference hub for MONGIL: STAR DIVE</p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Our Mission</h2>
            <p>
              MONGIL STAR DIVE Wiki is built to help players quickly find practical information, including reroll targets,
              code tracking, character priorities, banner decisions, and progression tips.
            </p>

            <h2>What We Cover</h2>
            <ul>
              <li>Reroll and beginner progression routes</li>
              <li>Character and team-building references</li>
              <li>Banner and event planning notes</li>
              <li>Code redemption and update tracking</li>
              <li>Community-friendly explanations of game systems</li>
            </ul>

            <h2>Editorial Principles</h2>
            <ul>
              <li><strong>Practical first:</strong> prioritize actionable guidance over filler.</li>
              <li><strong>Fast updates:</strong> revise key pages after major patches and announcements.</li>
              <li><strong>Clear sourcing:</strong> verify official links and in-game terminology before publishing.</li>
            </ul>

            <h2>Disclaimer</h2>
            <p>
              MONGIL STAR DIVE Wiki is an unofficial fan-made website and is not affiliated with, endorsed by, or
              associated with Netmarble.
            </p>

            <h2>Contact</h2>
            <p>If you want to report issues, submit corrections, or discuss collaboration, contact us:</p>
            <ul>
              <li>
                <strong>General:</strong>{' '}
                <a href="mailto:contact@mongilstardive.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contact@mongilstardive.wiki
                </a>
              </li>
              <li>
                <strong>Support:</strong>{' '}
                <a href="mailto:support@mongilstardive.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  support@mongilstardive.wiki
                </a>
              </li>
              <li>
                <strong>Content:</strong>{' '}
                <a href="mailto:contribute@mongilstardive.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  contribute@mongilstardive.wiki
                </a>
              </li>
              <li>
                <strong>Partnerships:</strong>{' '}
                <a href="mailto:partnerships@mongilstardive.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                  partnerships@mongilstardive.wiki
                </a>
              </li>
            </ul>
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
