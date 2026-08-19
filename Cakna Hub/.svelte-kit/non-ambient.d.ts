
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/about" | "/admin" | "/admin/analytics" | "/admin/calendar" | "/admin/dashboard" | "/admin/funding" | "/admin/login" | "/admin/media" | "/admin/notifications" | "/admin/notifications/new" | "/admin/programs" | "/admin/site" | "/admin/site/docs" | "/admin/site/[section]" | "/admin/users" | "/api" | "/api/auth" | "/api/auth/logout" | "/asma" | "/auth" | "/auth/login" | "/core" | "/core/[coreId]" | "/core/[coreId]/[program]" | "/csr-stories" | "/doa" | "/docs" | "/docs/[slug]" | "/halaqah" | "/hub" | "/hub/admin" | "/hub/admin/analytics" | "/hub/admin/api" | "/hub/admin/api/media" | "/hub/admin/calendar" | "/hub/admin/dashboard" | "/hub/admin/funding" | "/hub/admin/login" | "/hub/admin/media" | "/hub/admin/notifications" | "/hub/admin/notifications/new" | "/hub/admin/programs" | "/hub/admin/site" | "/hub/admin/site/docs" | "/hub/admin/site/docs/[slug]" | "/hub/admin/site/home" | "/hub/admin/site/[section]" | "/hub/admin/users" | "/ibadah" | "/khatam" | "/login" | "/logout" | "/mathurat" | "/mengaji" | "/mushaf" | "/notifications" | "/proxy" | "/proxy/[...path]" | "/puasa" | "/qibla" | "/search" | "/selawat" | "/setem" | "/society" | "/society/events" | "/society/events/new" | "/society/events/[id]" | "/society/funding" | "/society/funding/new" | "/society/funding/[id]" | "/solat" | "/surah" | "/yasin" | "/zakat" | "/zikir";
		RouteParams(): {
			"/admin/site/[section]": { section: string };
			"/core/[coreId]": { coreId: string };
			"/core/[coreId]/[program]": { coreId: string; program: string };
			"/docs/[slug]": { slug: string };
			"/hub/admin/site/docs/[slug]": { slug: string };
			"/hub/admin/site/[section]": { section: string };
			"/proxy/[...path]": { path: string };
			"/society/events/[id]": { id: string };
			"/society/funding/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { section?: string | undefined; coreId?: string | undefined; program?: string | undefined; slug?: string | undefined; path?: string | undefined; id?: string | undefined };
			"/about": Record<string, never>;
			"/admin": { section?: string | undefined };
			"/admin/analytics": Record<string, never>;
			"/admin/calendar": Record<string, never>;
			"/admin/dashboard": Record<string, never>;
			"/admin/funding": Record<string, never>;
			"/admin/login": Record<string, never>;
			"/admin/media": Record<string, never>;
			"/admin/notifications": Record<string, never>;
			"/admin/notifications/new": Record<string, never>;
			"/admin/programs": Record<string, never>;
			"/admin/site": { section?: string | undefined };
			"/admin/site/docs": Record<string, never>;
			"/admin/site/[section]": { section: string };
			"/admin/users": Record<string, never>;
			"/api": Record<string, never>;
			"/api/auth": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/asma": Record<string, never>;
			"/auth": Record<string, never>;
			"/auth/login": Record<string, never>;
			"/core": { coreId?: string | undefined; program?: string | undefined };
			"/core/[coreId]": { coreId: string; program?: string | undefined };
			"/core/[coreId]/[program]": { coreId: string; program: string };
			"/csr-stories": Record<string, never>;
			"/doa": Record<string, never>;
			"/docs": { slug?: string | undefined };
			"/docs/[slug]": { slug: string };
			"/halaqah": Record<string, never>;
			"/hub": { slug?: string | undefined; section?: string | undefined };
			"/hub/admin": { slug?: string | undefined; section?: string | undefined };
			"/hub/admin/analytics": Record<string, never>;
			"/hub/admin/api": Record<string, never>;
			"/hub/admin/api/media": Record<string, never>;
			"/hub/admin/calendar": Record<string, never>;
			"/hub/admin/dashboard": Record<string, never>;
			"/hub/admin/funding": Record<string, never>;
			"/hub/admin/login": Record<string, never>;
			"/hub/admin/media": Record<string, never>;
			"/hub/admin/notifications": Record<string, never>;
			"/hub/admin/notifications/new": Record<string, never>;
			"/hub/admin/programs": Record<string, never>;
			"/hub/admin/site": { slug?: string | undefined; section?: string | undefined };
			"/hub/admin/site/docs": { slug?: string | undefined };
			"/hub/admin/site/docs/[slug]": { slug: string };
			"/hub/admin/site/home": Record<string, never>;
			"/hub/admin/site/[section]": { section: string };
			"/hub/admin/users": Record<string, never>;
			"/ibadah": Record<string, never>;
			"/khatam": Record<string, never>;
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/mathurat": Record<string, never>;
			"/mengaji": Record<string, never>;
			"/mushaf": Record<string, never>;
			"/notifications": Record<string, never>;
			"/proxy": { path?: string | undefined };
			"/proxy/[...path]": { path: string };
			"/puasa": Record<string, never>;
			"/qibla": Record<string, never>;
			"/search": Record<string, never>;
			"/selawat": Record<string, never>;
			"/setem": Record<string, never>;
			"/society": { id?: string | undefined };
			"/society/events": { id?: string | undefined };
			"/society/events/new": Record<string, never>;
			"/society/events/[id]": { id: string };
			"/society/funding": { id?: string | undefined };
			"/society/funding/new": Record<string, never>;
			"/society/funding/[id]": { id: string };
			"/solat": Record<string, never>;
			"/surah": Record<string, never>;
			"/yasin": Record<string, never>;
			"/zakat": Record<string, never>;
			"/zikir": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/admin" | "/admin/analytics" | "/admin/calendar" | "/admin/dashboard" | "/admin/funding" | "/admin/login" | "/admin/media" | "/admin/notifications/new" | "/admin/programs" | "/admin/site" | "/admin/site/docs" | `/admin/site/${string}` & {} | "/admin/users" | "/api/auth/logout" | "/asma" | "/auth/login" | "/core" | `/core/${string}` & {} | `/core/${string}/${string}` & {} | "/csr-stories" | "/doa" | `/docs/${string}` & {} | "/halaqah" | "/hub" | "/hub/admin" | "/hub/admin/analytics" | "/hub/admin/api/media" | "/hub/admin/calendar" | "/hub/admin/dashboard" | "/hub/admin/funding" | "/hub/admin/login" | "/hub/admin/media" | "/hub/admin/notifications" | "/hub/admin/notifications/new" | "/hub/admin/programs" | "/hub/admin/site" | "/hub/admin/site/docs" | `/hub/admin/site/docs/${string}` & {} | "/hub/admin/site/home" | `/hub/admin/site/${string}` & {} | "/hub/admin/users" | "/ibadah" | "/khatam" | "/login" | "/logout" | "/mathurat" | "/mengaji" | "/mushaf" | "/notifications" | `/proxy/${string}` & {} | "/puasa" | "/qibla" | "/search" | "/selawat" | "/setem" | "/society" | "/society/events" | "/society/events/new" | `/society/events/${string}` & {} | "/society/funding" | "/society/funding/new" | `/society/funding/${string}` & {} | "/solat" | "/surah" | "/yasin" | "/zakat" | "/zikir";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/logo.jpg" | string & {};
	}
}