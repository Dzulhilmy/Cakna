export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["logo.jpg"]),
	mimeTypes: {".jpg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.BPMCwfe5.js",app:"_app/immutable/entry/app.DWlic2F-.js",imports:["_app/immutable/entry/start.BPMCwfe5.js","_app/immutable/chunks/C7SCDjR0.js","_app/immutable/chunks/BZ1Q6KqF.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/CoD1IjkS.js","_app/immutable/entry/app.DWlic2F-.js","_app/immutable/chunks/CLcWUy81.js","_app/immutable/chunks/DiA9xPaD.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BZ1Q6KqF.js","_app/immutable/chunks/SOZ6BI7K.js","_app/immutable/chunks/CBzXLWCh.js","_app/immutable/chunks/BKWMUsQB.js","_app/immutable/chunks/CnhEN6OZ.js","_app/immutable/chunks/BXo5XWtk.js","_app/immutable/chunks/CQGCE9A3.js","_app/immutable/chunks/CoD1IjkS.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/33.js')),
			__memo(() => import('./nodes/34.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js')),
			__memo(() => import('./nodes/38.js')),
			__memo(() => import('./nodes/39.js')),
			__memo(() => import('./nodes/40.js')),
			__memo(() => import('./nodes/41.js')),
			__memo(() => import('./nodes/42.js')),
			__memo(() => import('./nodes/43.js')),
			__memo(() => import('./nodes/44.js')),
			__memo(() => import('./nodes/45.js')),
			__memo(() => import('./nodes/46.js')),
			__memo(() => import('./nodes/47.js')),
			__memo(() => import('./nodes/48.js')),
			__memo(() => import('./nodes/49.js')),
			__memo(() => import('./nodes/50.js')),
			__memo(() => import('./nodes/51.js')),
			__memo(() => import('./nodes/52.js')),
			__memo(() => import('./nodes/53.js')),
			__memo(() => import('./nodes/54.js')),
			__memo(() => import('./nodes/55.js')),
			__memo(() => import('./nodes/56.js')),
			__memo(() => import('./nodes/57.js')),
			__memo(() => import('./nodes/58.js')),
			__memo(() => import('./nodes/59.js')),
			__memo(() => import('./nodes/60.js')),
			__memo(() => import('./nodes/61.js')),
			__memo(() => import('./nodes/62.js')),
			__memo(() => import('./nodes/63.js')),
			__memo(() => import('./nodes/64.js')),
			__memo(() => import('./nodes/65.js')),
			__memo(() => import('./nodes/66.js')),
			__memo(() => import('./nodes/67.js')),
			__memo(() => import('./nodes/68.js')),
			__memo(() => import('./nodes/69.js')),
			__memo(() => import('./nodes/70.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/about",
				pattern: /^\/about\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin/analytics",
				pattern: /^\/admin\/analytics\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin/calendar",
				pattern: /^\/admin\/calendar\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/admin/dashboard",
				pattern: /^\/admin\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/admin/funding",
				pattern: /^\/admin\/funding\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/admin/login",
				pattern: /^\/admin\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/admin/media",
				pattern: /^\/admin\/media\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/admin/notifications/new",
				pattern: /^\/admin\/notifications\/new\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/admin/programs",
				pattern: /^\/admin\/programs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/admin/site",
				pattern: /^\/admin\/site\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/admin/site/docs",
				pattern: /^\/admin\/site\/docs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/admin/site/[section]",
				pattern: /^\/admin\/site\/([^/]+?)\/?$/,
				params: [{"name":"section","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/api/auth/logout",
				pattern: /^\/api\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/logout/_server.ts.js'))
			},
			{
				id: "/asma",
				pattern: /^\/asma\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/core",
				pattern: /^\/core\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/core/[coreId]",
				pattern: /^\/core\/([^/]+?)\/?$/,
				params: [{"name":"coreId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/core/[coreId]/[program]",
				pattern: /^\/core\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"coreId","optional":false,"rest":false,"chained":false},{"name":"program","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/csr-stories",
				pattern: /^\/csr-stories\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/doa",
				pattern: /^\/doa\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/docs/[slug]",
				pattern: /^\/docs\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/halaqah",
				pattern: /^\/halaqah\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/hub",
				pattern: /^\/hub\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/hub/admin",
				pattern: /^\/hub\/admin\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/hub/admin/analytics",
				pattern: /^\/hub\/admin\/analytics\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/hub/admin/api/media",
				pattern: /^\/hub\/admin\/api\/media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/hub/admin/api/media/_server.ts.js'))
			},
			{
				id: "/hub/admin/calendar",
				pattern: /^\/hub\/admin\/calendar\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/hub/admin/dashboard",
				pattern: /^\/hub\/admin\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/hub/admin/funding",
				pattern: /^\/hub\/admin\/funding\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/hub/admin/login",
				pattern: /^\/hub\/admin\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/hub/admin/media",
				pattern: /^\/hub\/admin\/media\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/hub/admin/notifications",
				pattern: /^\/hub\/admin\/notifications\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/hub/admin/notifications/new",
				pattern: /^\/hub\/admin\/notifications\/new\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/hub/admin/programs",
				pattern: /^\/hub\/admin\/programs\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/hub/admin/site",
				pattern: /^\/hub\/admin\/site\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/hub/admin/site/docs",
				pattern: /^\/hub\/admin\/site\/docs\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/hub/admin/site/docs/[slug]",
				pattern: /^\/hub\/admin\/site\/docs\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/hub/admin/site/home",
				pattern: /^\/hub\/admin\/site\/home\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/hub/admin/site/[section]",
				pattern: /^\/hub\/admin\/site\/([^/]+?)\/?$/,
				params: [{"name":"section","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/hub/admin/users",
				pattern: /^\/hub\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/ibadah",
				pattern: /^\/ibadah\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/khatam",
				pattern: /^\/khatam\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/mathurat",
				pattern: /^\/mathurat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/mengaji",
				pattern: /^\/mengaji\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/mushaf",
				pattern: /^\/mushaf\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/notifications",
				pattern: /^\/notifications\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/proxy/[...path]",
				pattern: /^\/proxy(?:\/([^]*))?\/?$/,
				params: [{"name":"path","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/proxy/_...path_/_server.ts.js'))
			},
			{
				id: "/puasa",
				pattern: /^\/puasa\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/qibla",
				pattern: /^\/qibla\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/search",
				pattern: /^\/search\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/selawat",
				pattern: /^\/selawat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/setem",
				pattern: /^\/setem\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/society",
				pattern: /^\/society\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/society/events",
				pattern: /^\/society\/events\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/society/events/new",
				pattern: /^\/society\/events\/new\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/society/events/[id]",
				pattern: /^\/society\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,], errors: [1,,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/society/funding",
				pattern: /^\/society\/funding\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 63 },
				endpoint: null
			},
			{
				id: "/society/funding/new",
				pattern: /^\/society\/funding\/new\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 65 },
				endpoint: null
			},
			{
				id: "/society/funding/[id]",
				pattern: /^\/society\/funding\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,], errors: [1,,], leaf: 64 },
				endpoint: null
			},
			{
				id: "/solat",
				pattern: /^\/solat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 66 },
				endpoint: null
			},
			{
				id: "/surah",
				pattern: /^\/surah\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 67 },
				endpoint: null
			},
			{
				id: "/yasin",
				pattern: /^\/yasin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 68 },
				endpoint: null
			},
			{
				id: "/zakat",
				pattern: /^\/zakat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 69 },
				endpoint: null
			},
			{
				id: "/zikir",
				pattern: /^\/zikir\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 70 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
