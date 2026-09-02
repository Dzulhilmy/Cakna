import type { SiteContent } from './site';
import { defaultSiteContent } from './site';

/**
 * Build English content by overlaying default English text over the CMS content,
 * preserving all media (images, logos), contact details, and structural settings.
 */
export function buildEnglishContent(ms: SiteContent): SiteContent {
	return {
		...defaultSiteContent,
		brand: { ...defaultSiteContent.brand, logoImage: ms.brand.logoImage },
		hero: { ...defaultSiteContent.hero, bgImages: ms.hero.bgImages, overlay: ms.hero.overlay },
		about: {
			...defaultSiteContent.about,
			quoteBgImages: ms.about.quoteBgImages,
			quoteOverlay: ms.about.quoteOverlay,
		},
		cta: { ...defaultSiteContent.cta, bgImages: ms.cta.bgImages, overlay: ms.cta.overlay },
		homeGallery: { ...defaultSiteContent.homeGallery, images: ms.homeGallery.images },
		partners: { ...defaultSiteContent.partners, logos: ms.partners.logos },
		aboutPage: {
			...defaultSiteContent.aboutPage,
			heroBgImages: ms.aboutPage.heroBgImages,
			heroOverlay: ms.aboutPage.heroOverlay,
			ctaBgImages: ms.aboutPage.ctaBgImages,
			ctaOverlay: ms.aboutPage.ctaOverlay,
		},
		setemPage: {
			...defaultSiteContent.setemPage,
			heroBgImages: ms.setemPage.heroBgImages,
			heroOverlay: ms.setemPage.heroOverlay,
			ctaBgImages: ms.setemPage.ctaBgImages,
			ctaOverlay: ms.setemPage.ctaOverlay,
		},
		csrPage: {
			...defaultSiteContent.csrPage,
			heroBgImages: ms.csrPage.heroBgImages,
			heroOverlay: ms.csrPage.heroOverlay,
			ctaBgImages: ms.csrPage.ctaBgImages,
			ctaOverlay: ms.csrPage.ctaOverlay,
			stories: ms.csrPage.stories,
		},
		footer: {
			...defaultSiteContent.footer,
			phone: ms.footer.phone,
			email: ms.footer.email,
		},
		customSections: ms.customSections,
		sectionOrder: ms.sectionOrder,
		docs: ms.docs,
	};
}
