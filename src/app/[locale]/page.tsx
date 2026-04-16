import { getLatestArticles } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'
import type { Language } from '@/lib/content'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

const HOME_TITLE = 'MONGIL STAR DIVE - Codes, Reroll & Tier List'
const HOME_DESCRIPTION =
  "Track MONGIL STAR DIVE codes, reroll targets, tier lists, banners, characters, and beginner progression guides for Netmarble's mobile and PC RPG."
const HOME_VIDEO_ID = 'VjLhVHAX6po'
const HOME_VIDEO_TITLE = 'MONGIL: STAR DIVE | Launch PV (Full ver.)'
const HOME_KEYWORDS = [
  'MONGIL STAR DIVE',
  'Netmarble',
  'codes',
  'reroll',
  'tier list',
  'banners',
  'characters',
  'guide',
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mongilstardive.wiki'

  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    keywords: HOME_KEYWORDS,
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      siteName: 'MONGIL STAR DIVE Wiki',
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      url: locale === 'en' ? siteUrl : `${siteUrl}/${locale}`,
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
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      images: [`${siteUrl}/images/hero.webp`],
      creator: '@Stardive_EN',
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)
  // Homepage modules should render as plain text titles without internal article deep-links.
  const moduleLinkMap = {} as ModuleLinkMap

  return (
    <HomePageClient
      latestArticles={latestArticles}
      moduleLinkMap={moduleLinkMap}
      locale={locale}
      videoId={HOME_VIDEO_ID}
      videoTitle={HOME_VIDEO_TITLE}
    />
  )
}
