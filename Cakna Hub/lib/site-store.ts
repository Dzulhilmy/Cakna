// Server-only persistence for the public site content (data/site.json).
import { promises as fs } from "fs";
import path from "path";
import { defaultSiteContent, type SiteContent } from "./site";

const FILE = path.join(process.cwd(), "data", "site.json");

function migrateImgs(saved: unknown, field: string, legacyField?: string): string[] {
  const obj = saved as Record<string, unknown> | null | undefined;
  if (!obj) return [];
  if (Array.isArray(obj[field])) return obj[field] as string[];
  // Migrate old single-string field to array
  const legacy = legacyField ?? field.replace(/bgImages$/, "image").replace(/BgImages$/, "Image");
  if (typeof obj[legacy] === "string" && (obj[legacy] as string).trim()) {
    return [obj[legacy] as string];
  }
  return [];
}

function merge(s: Partial<SiteContent> | null): SiteContent {
  const d = defaultSiteContent;
  if (!s || typeof s !== "object") return d;
  return {
    brand: { ...d.brand, ...s.brand },
    nav: Array.isArray(s.nav) && s.nav.length ? s.nav : d.nav,
    hero: {
      ...d.hero,
      ...s.hero,
      bgImages: migrateImgs(s.hero, "bgImages"),
      primaryCta: { ...d.hero.primaryCta, ...s.hero?.primaryCta },
      secondaryCta: { ...d.hero.secondaryCta, ...s.hero?.secondaryCta },
    },
    about: {
      ...d.about,
      ...s.about,
      quoteBgImages: migrateImgs(s.about, "quoteBgImages", "quoteImage"),
    },
    programs: { ...d.programs, ...s.programs },
    impact: {
      ...d.impact,
      ...s.impact,
      stats:
        Array.isArray(s.impact?.stats) && s.impact.stats.length
          ? s.impact.stats
          : d.impact.stats,
    },
    cta: {
      ...d.cta,
      ...s.cta,
      bgImages: migrateImgs(s.cta, "bgImages"),
      primaryCta: { ...d.cta.primaryCta, ...s.cta?.primaryCta },
      secondaryCta: { ...d.cta.secondaryCta, ...s.cta?.secondaryCta },
    },
    homeGallery: {
      ...d.homeGallery,
      ...s.homeGallery,
      images: arr(s.homeGallery?.images, d.homeGallery.images),
    },
    partners: {
      ...d.partners,
      ...s.partners,
      logos: arr(s.partners?.logos, d.partners.logos),
    },
    footer: { ...d.footer, ...s.footer },
    aboutPage: {
      ...d.aboutPage,
      ...s.aboutPage,
      heroBgImages: migrateImgs(s.aboutPage, "heroBgImages", "heroImage"),
      ctaBgImages: migrateImgs(s.aboutPage, "ctaBgImages", "ctaImage"),
      purpose: arr(s.aboutPage?.purpose, d.aboutPage.purpose),
      stats: arr(s.aboutPage?.stats, d.aboutPage.stats),
    },
    setemPage: {
      ...d.setemPage,
      ...s.setemPage,
      heroBgImages: migrateImgs(s.setemPage, "heroBgImages", "heroImage"),
      ctaBgImages: migrateImgs(s.setemPage, "ctaBgImages", "ctaImage"),
      gapStats: arr(s.setemPage?.gapStats, d.setemPage.gapStats),
      expect: arr(s.setemPage?.expect, d.setemPage.expect),
      audience: arr(s.setemPage?.audience, d.setemPage.audience),
      steps: arr(s.setemPage?.steps, d.setemPage.steps),
    },
    csrPage: {
      ...d.csrPage,
      ...s.csrPage,
      heroBgImages: migrateImgs(s.csrPage, "heroBgImages", "heroImage"),
      ctaBgImages: migrateImgs(s.csrPage, "ctaBgImages", "ctaImage"),
      stories: arr(s.csrPage?.stories, d.csrPage.stories),
    },
    customSections: {
      home: arr(s.customSections?.home, d.customSections.home),
      about: arr(s.customSections?.about, d.customSections.about),
      setem: arr(s.customSections?.setem, d.customSections.setem),
      csr: arr(s.customSections?.csr, d.customSections.csr),
    },
    docs: {
      policy: { ...d.docs.policy, ...s.docs?.policy },
      sop: { ...d.docs.sop, ...s.docs?.sop },
      guidelines: { ...d.docs.guidelines, ...s.docs?.guidelines },
      manual: { ...d.docs.manual, ...s.docs?.manual },
    },
  };
}

function arr<T>(value: T[] | undefined, fallback: T[]): T[] {
  return Array.isArray(value) ? value : fallback;
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return merge(JSON.parse(raw));
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(merge(content), null, 2), "utf8");
}
