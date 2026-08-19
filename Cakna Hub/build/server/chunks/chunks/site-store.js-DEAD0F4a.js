import { d as defaultSiteContent, D as DEFAULT_CSR_ORDER, a as DEFAULT_SETEM_ORDER, b as DEFAULT_ABOUT_ORDER, c as DEFAULT_HOME_ORDER } from './site.js-C3FcLbLW.js';
import { b as hubGet, c as hubGetPublic, a as hubPut } from './hub-api.js-BLc0YvhW.js';

async function getSiteContent(actor) {
  try {
    const raw = actor ? await hubGet(actor, "/site") : await hubGetPublic("/site");
    return merge(raw);
  } catch {
    return defaultSiteContent;
  }
}
async function saveSiteContent(actor, content) {
  await hubPut(actor, "/site", merge(content));
}
function migrateImgs(saved, field, legacyField) {
  const obj = saved;
  if (!obj) return [];
  if (Array.isArray(obj[field])) return obj[field];
  const legacy = legacyField ?? field.replace(/bgImages$/, "image").replace(/BgImages$/, "Image");
  if (typeof obj[legacy] === "string" && obj[legacy].trim()) return [obj[legacy]];
  return [];
}
function arr(value, fallback) {
  return Array.isArray(value) ? value : fallback;
}
function mergeOrder(saved, defaults) {
  if (!Array.isArray(saved) || saved.length === 0) return [...defaults];
  const extra = defaults.filter((k) => !saved.includes(k));
  return [...saved, ...extra];
}
function merge(s) {
  const d = defaultSiteContent;
  if (!s || typeof s !== "object") return d;
  return {
    brand: { ...d.brand, ...s.brand },
    nav: Array.isArray(s.nav) && s.nav.length ? s.nav : d.nav,
    hero: { ...d.hero, ...s.hero, bgImages: migrateImgs(s.hero, "bgImages"), primaryCta: { ...d.hero.primaryCta, ...s.hero?.primaryCta }, secondaryCta: { ...d.hero.secondaryCta, ...s.hero?.secondaryCta } },
    about: { ...d.about, ...s.about, quoteBgImages: migrateImgs(s.about, "quoteBgImages", "quoteImage") },
    programs: { ...d.programs, ...s.programs },
    impact: { ...d.impact, ...s.impact, stats: Array.isArray(s.impact?.stats) && s.impact.stats.length ? s.impact.stats : d.impact.stats },
    cta: { ...d.cta, ...s.cta, bgImages: migrateImgs(s.cta, "bgImages"), primaryCta: { ...d.cta.primaryCta, ...s.cta?.primaryCta }, secondaryCta: { ...d.cta.secondaryCta, ...s.cta?.secondaryCta } },
    homeGallery: { ...d.homeGallery, ...s.homeGallery, images: arr(s.homeGallery?.images, d.homeGallery.images) },
    partners: { ...d.partners, ...s.partners, logos: arr(s.partners?.logos, d.partners.logos) },
    footer: { ...d.footer, ...s.footer },
    aboutPage: { ...d.aboutPage, ...s.aboutPage, heroBgImages: migrateImgs(s.aboutPage, "heroBgImages", "heroImage"), ctaBgImages: migrateImgs(s.aboutPage, "ctaBgImages", "ctaImage"), purpose: arr(s.aboutPage?.purpose, d.aboutPage.purpose), stats: arr(s.aboutPage?.stats, d.aboutPage.stats) },
    setemPage: { ...d.setemPage, ...s.setemPage, heroBgImages: migrateImgs(s.setemPage, "heroBgImages", "heroImage"), ctaBgImages: migrateImgs(s.setemPage, "ctaBgImages", "ctaImage"), gapStats: arr(s.setemPage?.gapStats, d.setemPage.gapStats), expect: arr(s.setemPage?.expect, d.setemPage.expect), audience: arr(s.setemPage?.audience, d.setemPage.audience), steps: arr(s.setemPage?.steps, d.setemPage.steps) },
    csrPage: { ...d.csrPage, ...s.csrPage, heroBgImages: migrateImgs(s.csrPage, "heroBgImages", "heroImage"), ctaBgImages: migrateImgs(s.csrPage, "ctaBgImages", "ctaImage"), stories: arr(s.csrPage?.stories, d.csrPage.stories) },
    customSections: { home: arr(s.customSections?.home, d.customSections.home), about: arr(s.customSections?.about, d.customSections.about), setem: arr(s.customSections?.setem, d.customSections.setem), csr: arr(s.customSections?.csr, d.customSections.csr) },
    sectionOrder: {
      home: mergeOrder(s.sectionOrder?.home, DEFAULT_HOME_ORDER),
      aboutPage: mergeOrder(s.sectionOrder?.aboutPage, DEFAULT_ABOUT_ORDER),
      setemPage: mergeOrder(s.sectionOrder?.setemPage, DEFAULT_SETEM_ORDER),
      csrPage: mergeOrder(s.sectionOrder?.csrPage, DEFAULT_CSR_ORDER)
    },
    docs: { policy: { ...d.docs.policy, ...s.docs?.policy }, sop: { ...d.docs.sop, ...s.docs?.sop }, guidelines: { ...d.docs.guidelines, ...s.docs?.guidelines }, manual: { ...d.docs.manual, ...s.docs?.manual } }
  };
}

export { getSiteContent as g, saveSiteContent as s };
//# sourceMappingURL=site-store.js-DEAD0F4a.js.map
