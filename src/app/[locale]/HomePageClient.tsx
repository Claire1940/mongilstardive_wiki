'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Eye,
  ExternalLink,
  Gamepad2,
  Hammer,
  Home,
  MessageCircle,
  Package,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
  videoId: string
  videoTitle: string
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
  videoId,
  videoTitle,
}: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mongilstardive.wiki'
  const officialLinks = {
    site: 'https://stardive.netmarble.com/en/',
    discord: 'https://discord.gg/stardive',
    x: 'https://x.com/Stardive_EN',
    youtube: 'https://www.youtube.com/@Stardive_EN',
    forum: 'https://forum.netmarble.com/stardive_gl',
    reddit: 'https://www.reddit.com/r/MongilStarDive/',
  }

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'MONGIL STAR DIVE Wiki',
        description: 'Track MONGIL STAR DIVE codes, reroll targets, tier lists, banners, characters, and beginner progression guides.',
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: 'MONGIL STAR DIVE hero visual',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'MONGIL STAR DIVE Wiki',
        alternateName: 'MONGIL STAR DIVE',
        url: siteUrl,
        description: 'Community-driven resource hub for MONGIL STAR DIVE strategy, reroll, codes, and banner planning.',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: 'MONGIL STAR DIVE hero visual',
        },
        sameAs: [
          officialLinks.site,
          officialLinks.discord,
          officialLinks.x,
          officialLinks.youtube,
          officialLinks.forum,
          officialLinks.reddit,
        ],
      },
      {
        '@type': 'VideoGame',
        name: 'MONGIL: STAR DIVE',
        gamePlatform: ['PC', 'Android', 'iOS'],
        applicationCategory: 'Game',
        genre: ['Action RPG', 'Monster Taming', 'Anime Fantasy'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: officialLinks.site,
        },
      },
    ],
  }

  // FAQ accordion states
  const [bestSettingsExpanded, setBestSettingsExpanded] = useState<number | null>(null)
  const [crossplayExpanded, setCrossplayExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href={officialLinks.site}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href={officialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId={videoId}
              title={videoTitle}
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'beginner-guide', 'apotheosis-crafting', 'tools-weapons', 'storage-inventory',
                'qualia-base-building', 'world-regions', 'creatures-enemies', 'mobility-gear',
                'farming-growth', 'best-early-unlocks', 'achievement-tracker', 'singleplayer-faq',
                'news-updates', 'system-requirements', 'best-settings', 'crossplay'
              ]
              const sectionId = sectionIds[index]

              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(sectionId)
                  }}
                  className="scroll-reveal group block p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Codes */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksBeginnerGuide']} locale={locale}>
                {t.modules.lucidBlocksBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.lucidBlocksBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.lucidBlocksBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Beginner Guide */}
      <section id="apotheosis-crafting" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksApotheosisCrafting']} locale={locale}>{t.modules.lucidBlocksApotheosisCrafting.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksApotheosisCrafting.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksApotheosisCrafting.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksApotheosisCrafting::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksApotheosisCrafting.milestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Tier List */}
      <section id="tools-weapons" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksToolsAndWeapons']} locale={locale}>{t.modules.lucidBlocksToolsAndWeapons.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksToolsAndWeapons.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksToolsAndWeapons.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Hammer className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksToolsAndWeapons::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Reroll Guide */}
      <section id="storage-inventory" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksStorageAndInventory']} locale={locale}>{t.modules.lucidBlocksStorageAndInventory.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksStorageAndInventory.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksStorageAndInventory.solutions.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksStorageAndInventory::solutions::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{s.role}</span>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold">Management Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.lucidBlocksStorageAndInventory.managementTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 5: Best Teams */}
      <section id="qualia-base-building" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksQualiaAndBaseBuilding']} locale={locale}>{t.modules.lucidBlocksQualiaAndBaseBuilding.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksQualiaAndBaseBuilding.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksQualiaAndBaseBuilding::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.highlights.map((h: string, i: number) => (
              <div key={i} className="p-4 bg-white/5 border border-border rounded-xl text-center hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <Home className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mx-auto mb-2" />
                <p className="text-sm">{h}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Best Builds */}
      <section id="world-regions" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksWorldRegions']} locale={locale}>{t.modules.lucidBlocksWorldRegions.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksWorldRegions.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.lucidBlocksWorldRegions.regions.map((region: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksWorldRegions::regions::${index}`]} locale={locale}>
                      {region.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{region.type}</span>
                </div>
                <p className="text-muted-foreground text-sm">{region.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Best Monsterlings */}
      <section id="creatures-enemies" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksCreaturesAndEnemies']} locale={locale}>{t.modules.lucidBlocksCreaturesAndEnemies.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksCreaturesAndEnemies.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksCreaturesAndEnemies.creatures.map((c: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${
                      c.role.includes('S Tier')
                        ? 'bg-[hsl(var(--nav-theme)/0.22)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]'
                        : c.role.includes('A Tier')
                          ? 'bg-[hsl(var(--nav-theme)/0.16)] border-[hsl(var(--nav-theme)/0.38)] text-[hsl(var(--nav-theme-light))]'
                          : 'bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]'
                    }`}
                  >
                    {c.role}
                  </span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCreaturesAndEnemies::creatures::${index}`]} locale={locale}>
                    {c.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Monster Codex */}
      <section id="mobility-gear" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksMobilityGear']} locale={locale}>{t.modules.lucidBlocksMobilityGear.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksMobilityGear.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {t.modules.lucidBlocksMobilityGear.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksMobilityGear::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksMobilityGear.unlockMilestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 9: Farming and Growth */}
      <section id="farming-growth" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksFarmingAndGrowth']} locale={locale}>{t.modules.lucidBlocksFarmingAndGrowth.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksFarmingAndGrowth.intro}</p>
          </div>
          <div className="scroll-reveal hidden lg:block mb-8">
            <div className="overflow-x-auto rounded-xl border border-border bg-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                  <tr>
                    <th className="px-4 py-3 border-b border-border">Artifact</th>
                    <th className="px-4 py-3 border-b border-border">Role</th>
                    <th className="px-4 py-3 border-b border-border">Core Effect</th>
                    <th className="px-4 py-3 border-b border-border">Best Users</th>
                    <th className="px-4 py-3 border-b border-border">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {t.modules.lucidBlocksFarmingAndGrowth.artifacts.map((artifact: any, index: number) => (
                    <tr key={index} className="align-top border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-4">
                        <p className="font-semibold">
                          <LinkedTitle linkData={moduleLinkMap[`lucidBlocksFarmingAndGrowth::artifacts::${index}`]} locale={locale}>
                            {artifact.artifact}
                          </LinkedTitle>
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.16)] border border-[hsl(var(--nav-theme)/0.35)]">
                            {artifact.rarity}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                            Max ATK: {artifact.maxAtk}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                          {artifact.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 space-y-2">
                        <p className="text-muted-foreground">
                          <span className="text-foreground font-medium">Equip:</span> {artifact.equipEffect}
                        </p>
                        <p className="text-muted-foreground">{artifact.baseEffect}</p>
                        <p className="text-xs text-muted-foreground">{artifact.fusionBonus}</p>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {artifact.bestUsers.join(', ')}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-[hsl(var(--nav-theme-light))]">{artifact.grade}</p>
                        <p className="text-xs text-muted-foreground mt-2">{artifact.whyUseIt}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 lg:hidden">
            {t.modules.lucidBlocksFarmingAndGrowth.artifacts.map((artifact: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksFarmingAndGrowth::artifacts::${index}`]} locale={locale}>
                      {artifact.artifact}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.14)] border border-[hsl(var(--nav-theme)/0.32)]">
                    {artifact.rarity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Role: {artifact.role}</p>
                <p className="text-xs text-muted-foreground mb-2">Max ATK: {artifact.maxAtk}</p>
                <p className="text-sm text-muted-foreground mb-2">{artifact.baseEffect}</p>
                <p className="text-xs text-muted-foreground mb-3">{artifact.fusionBonus}</p>
                <p className="text-xs text-muted-foreground mb-2">Best Users: {artifact.bestUsers.join(', ')}</p>
                <p className="text-sm text-[hsl(var(--nav-theme-light))]">{artifact.grade}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksFarmingAndGrowth.highlights.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <TrendingUp className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Best Early Unlocks */}
      <section id="best-early-unlocks" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksBestEarlyUnlocks']} locale={locale}>{t.modules.lucidBlocksBestEarlyUnlocks.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksBestEarlyUnlocks.intro}</p>
          </div>
          <div className="scroll-reveal hidden lg:block mb-8">
            <div className="overflow-x-auto rounded-xl border border-border bg-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                  <tr>
                    <th className="px-4 py-3 border-b border-border">Set</th>
                    <th className="px-4 py-3 border-b border-border">Element</th>
                    <th className="px-4 py-3 border-b border-border">Best For</th>
                    <th className="px-4 py-3 border-b border-border">2-Piece Bonus</th>
                    <th className="px-4 py-3 border-b border-border">4-Piece Bonus & Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  {t.modules.lucidBlocksBestEarlyUnlocks.sets.map((set: any, index: number) => (
                    <tr key={index} className="align-top border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-4">
                        <p className="font-semibold">
                          <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBestEarlyUnlocks::sets::${index}`]} locale={locale}>
                            {set.set}
                          </LinkedTitle>
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
                          {set.element}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{set.bestFor.join(', ')}</td>
                      <td className="px-4 py-4 text-muted-foreground">{set.twoSet}</td>
                      <td className="px-4 py-4">
                        <p className="text-muted-foreground">{set.fourSet}</p>
                        <p className="text-xs text-muted-foreground mt-2">{set.useCase}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 lg:hidden">
            {t.modules.lucidBlocksBestEarlyUnlocks.sets.map((set: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-semibold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBestEarlyUnlocks::sets::${index}`]} locale={locale}>
                      {set.set}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {set.element}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Best For: {set.bestFor.join(', ')}</p>
                <p className="text-sm text-muted-foreground mb-2">{set.twoSet}</p>
                <p className="text-sm text-muted-foreground mb-2">{set.fourSet}</p>
                <p className="text-xs text-[hsl(var(--nav-theme-light))]">{set.useCase}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksBestEarlyUnlocks.setNotes.map((note: string, index: number) => (
              <span key={index} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Star className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                {note}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Achievement Tracker */}
      <section id="achievement-tracker" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksAchievementTracker']} locale={locale}>{t.modules.lucidBlocksAchievementTracker.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksAchievementTracker.intro}</p>
          </div>
          <div className="scroll-reveal p-6 bg-white/5 border border-border rounded-xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-semibold">Rarity Filters</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.modules.lucidBlocksAchievementTracker.filters.rarity.map((item: string, index: number) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-semibold">Element Filters</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.modules.lucidBlocksAchievementTracker.filters.elements.map((item: string, index: number) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-semibold">Role Filters</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.modules.lucidBlocksAchievementTracker.filters.roles.map((item: string, index: number) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {t.modules.lucidBlocksAchievementTracker.characters.map((character: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-semibold mb-3">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksAchievementTracker::characters::${index}`]} locale={locale}>
                    {character.name}
                  </LinkedTitle>
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.16)] border border-[hsl(var(--nav-theme)/0.35)]">
                    {character.rarity}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {character.element}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.28)]">
                    {character.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksAchievementTracker.managementNotes.map((note: string, index: number) => (
              <span key={index} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <ClipboardCheck className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                {note}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Singleplayer FAQ */}
      <section id="singleplayer-faq" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSingleplayerAndPlatformFAQ']} locale={locale}>{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.intro}</p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6 mb-8">
            {t.modules.lucidBlocksSingleplayerAndPlatformFAQ.timeline.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] top-1 w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{entry.date}</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSingleplayerAndPlatformFAQ::timeline::${index}`]} locale={locale}>
                      {entry.label}
                    </LinkedTitle>
                  </h3>
                  <p className="text-sm text-muted-foreground">{entry.details}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.lucidBlocksSingleplayerAndPlatformFAQ.platformSummary.map((item: string, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: News */}
      <section id="news-updates" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksSteamDeckAndController']} locale={locale}>
                {t.modules.lucidBlocksSteamDeckAndController.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksSteamDeckAndController.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6 mb-8">
            {t.modules.lucidBlocksSteamDeckAndController.items.map((item: any, index: number) => (
              <article key={index} className="relative">
                <div className="absolute -left-[1.55rem] top-4 w-5 h-5 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background flex items-center justify-center">
                  <DynamicIcon
                    name={item.icon}
                    className="w-3 h-3 text-white"
                  />
                </div>
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item.date}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.28)]">
                      {item.label}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{item.headline}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[hsl(var(--nav-theme-light))] hover:underline underline-offset-4"
                  >
                    Read Update
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.modules.lucidBlocksSteamDeckAndController.highlights.map((highlight: string, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl flex items-start gap-3">
                <Clock className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: System Requirements */}
      <section id="system-requirements" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksSettingsAndAccessibility']} locale={locale}>
                {t.modules.lucidBlocksSettingsAndAccessibility.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksSettingsAndAccessibility.intro}
            </p>
          </div>

          <div className="scroll-reveal hidden lg:block mb-8">
            <div className="overflow-x-auto rounded-xl border border-border bg-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                  <tr>
                    <th className="px-4 py-3 border-b border-border">Platform</th>
                    <th className="px-4 py-3 border-b border-border">Minimum</th>
                    <th className="px-4 py-3 border-b border-border">Recommended</th>
                    <th className="px-4 py-3 border-b border-border">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {t.modules.lucidBlocksSettingsAndAccessibility.platforms.map((platform: any, index: number) => (
                    <tr key={index} className="align-top border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.3)]">
                          <Star className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                          {platform.platform}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <ul className="space-y-2 text-muted-foreground">
                          {platform.minimum.map((item: string, minimumIndex: number) => (
                            <li key={minimumIndex} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-4">
                        <ul className="space-y-2 text-muted-foreground">
                          {platform.recommended.map((item: string, recommendedIndex: number) => (
                            <li key={recommendedIndex} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{platform.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {t.modules.lucidBlocksSettingsAndAccessibility.platforms.map((platform: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl">
                <h3 className="font-semibold mb-3 text-[hsl(var(--nav-theme-light))]">{platform.platform}</h3>
                <div className="space-y-3 mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Minimum</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {platform.minimum.map((item: string, minimumIndex: number) => (
                        <li key={minimumIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Recommended</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {platform.recommended.map((item: string, recommendedIndex: number) => (
                        <li key={recommendedIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{platform.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Best Settings */}
      <section id="best-settings" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksUpdatesAndPatchNotes']} locale={locale}>
                {t.modules.lucidBlocksUpdatesAndPatchNotes.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksUpdatesAndPatchNotes.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.lucidBlocksUpdatesAndPatchNotes.presets.map((preset: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden bg-white/5">
                <button
                  onClick={() => setBestSettingsExpanded(bestSettingsExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <div>
                      <p className="font-semibold">{preset.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{preset.target}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${bestSettingsExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {bestSettingsExpanded === index && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground">{preset.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16: Crossplay */}
      <section id="crossplay" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksCrashFixAndTroubleshooting']} locale={locale}>
                {t.modules.lucidBlocksCrashFixAndTroubleshooting.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksCrashFixAndTroubleshooting.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 mb-8">
            {t.modules.lucidBlocksCrashFixAndTroubleshooting.questions.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden bg-white/5">
                <button
                  onClick={() => setCrossplayExpanded(crossplayExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <span className="font-semibold">{item.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${crossplayExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {crossplayExpanded === index && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground">{item.answer}</div>
                )}
              </div>
            ))}
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {t.modules.lucidBlocksCrashFixAndTroubleshooting.highlights.map((highlight: string, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.35)] rounded-xl">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">MONGIL STAR DIVE Official Channels</h3>
                <p className="text-sm text-muted-foreground mb-3">Follow official channels for platform support and account service announcements.</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={officialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                  >
                    Discord
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={officialLinks.forum}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                  >
                    Official Forum
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
          joinCommunityHref={officialLinks.discord}
          joinGameHref={officialLinks.site}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={officialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href={officialLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href={officialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href={officialLinks.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
