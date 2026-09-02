import { browser } from '$app/environment';

const LS_KEY = 'cakna:pubLang';

let lang = $state<'ms' | 'en'>(
	browser ? (localStorage.getItem(LS_KEY) === 'en' ? 'en' : 'ms') : 'ms'
);

export const publicLang = {
	get value(): 'ms' | 'en' {
		return lang;
	},
	toggle() {
		lang = lang === 'ms' ? 'en' : 'ms';
		if (browser) localStorage.setItem(LS_KEY, lang);
	},
};
