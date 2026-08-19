import i18nData from '$data/i18n.json';
import { settings } from './stores.svelte';

type Dict = Record<string, string>;
const dicts = i18nData as unknown as {
	ms: Dict;
	en: Dict;
	onb: { ms: [string, string][]; en: [string, string][] };
	onb_icons: string[];
};

/** UI translation with {var} interpolation — port of the sample's T(). */
export function t(key: string, vars?: Record<string, string | number>): string {
	const lang = settings.value.uiLang;
	let s = dicts[lang]?.[key] ?? dicts.ms[key] ?? key;
	if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
	return s;
}

export function onboardingSlides(): [string, string][] {
	return dicts.onb[settings.value.uiLang] ?? dicts.onb.ms;
}
export const onboardingIcons = dicts.onb_icons;
