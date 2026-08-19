const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_hub",
	appPath: "_hub",
	assets: new Set(["logo.jpg"]),
	mimeTypes: {".jpg":"image/jpeg"},
	_: {
		client: {start:"_hub/immutable/entry/start.B6ESrRHI.js",app:"_hub/immutable/entry/app.Bg7EepM9.js",imports:["_hub/immutable/entry/start.B6ESrRHI.js","_hub/immutable/chunks/DhvoMARV.js","_hub/immutable/chunks/C7Z3kzOn.js","_hub/immutable/chunks/BmAo81-1.js","_hub/immutable/chunks/BvwgH46V.js","_hub/immutable/chunks/B_IGOnkZ.js","_hub/immutable/entry/app.Bg7EepM9.js","_hub/immutable/chunks/BmAo81-1.js","_hub/immutable/chunks/BvwgH46V.js","_hub/immutable/chunks/Bzak7iHL.js","_hub/immutable/chunks/C7Z3kzOn.js","_hub/immutable/chunks/BtVcZamz.js","_hub/immutable/chunks/CMpiL8cG.js","_hub/immutable/chunks/B6yR13SU.js","_hub/immutable/chunks/DZG4NVie.js","_hub/immutable/chunks/vm-IsJFG.js","_hub/immutable/chunks/Bh8D0fOI.js","_hub/immutable/chunks/B_IGOnkZ.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js-Brz347Ny.js')),
			__memo(() => import('./nodes/1.js-Balp7Xf0.js')),
			__memo(() => import('./nodes/2.js-v0bUn9Od.js')),
			__memo(() => import('./nodes/3.js-BzA4Bc2v.js')),
			__memo(() => import('./nodes/4.js-qKI623W2.js')),
			__memo(() => import('./nodes/5.js-CREYQEq_.js')),
			__memo(() => import('./nodes/6.js-CjAvl4dq.js')),
			__memo(() => import('./nodes/7.js-DXGFWSKI.js')),
			__memo(() => import('./nodes/8.js-6vjQawHS.js')),
			__memo(() => import('./nodes/9.js-lR35DcmC.js')),
			__memo(() => import('./nodes/10.js-BS4BQSGl.js')),
			__memo(() => import('./nodes/11.js-BOSHbPvl.js')),
			__memo(() => import('./nodes/12.js-CfIA8maG.js')),
			__memo(() => import('./nodes/13.js-D6AvmQKq.js')),
			__memo(() => import('./nodes/14.js-BAN4ai2z.js')),
			__memo(() => import('./nodes/15.js-DlhWY5um.js')),
			__memo(() => import('./nodes/16.js-Cvp-WrQG.js')),
			__memo(() => import('./nodes/17.js-Dn8bJdCZ.js')),
			__memo(() => import('./nodes/18.js-C7OfNf6x.js')),
			__memo(() => import('./nodes/19.js-B41aI5ba.js')),
			__memo(() => import('./nodes/20.js--fKf9jtf.js')),
			__memo(() => import('./nodes/21.js-BqeApH-0.js')),
			__memo(() => import('./nodes/22.js-DVZfzkVh.js')),
			__memo(() => import('./nodes/23.js-D17LYGKF.js')),
			__memo(() => import('./nodes/24.js-39mnuW67.js')),
			__memo(() => import('./nodes/25.js-CoC5VzYU.js')),
			__memo(() => import('./nodes/26.js-CW9ypZFU.js')),
			__memo(() => import('./nodes/27.js-Ddo94rTY.js')),
			__memo(() => import('./nodes/28.js-DYcawBbD.js')),
			__memo(() => import('./nodes/29.js-BBMGIPK0.js')),
			__memo(() => import('./nodes/30.js-CIvRAFSA.js')),
			__memo(() => import('./nodes/31.js-CYo9M3d5.js')),
			__memo(() => import('./nodes/32.js-CAXbtKG2.js')),
			__memo(() => import('./nodes/33.js-TQzsSMhi.js')),
			__memo(() => import('./nodes/34.js-Bv_pSlCI.js')),
			__memo(() => import('./nodes/35.js-UTSiqi5d.js')),
			__memo(() => import('./nodes/36.js-DlkY9m3n.js')),
			__memo(() => import('./nodes/37.js-53zWpI7y.js')),
			__memo(() => import('./nodes/38.js-Cpz2R6jO.js')),
			__memo(() => import('./nodes/39.js-C908IW0l.js')),
			__memo(() => import('./nodes/40.js-D9f-2G53.js')),
			__memo(() => import('./nodes/41.js-Csdtc_rz.js')),
			__memo(() => import('./nodes/42.js-CQSgYO0A.js')),
			__memo(() => import('./nodes/43.js-D9G3OTlD.js')),
			__memo(() => import('./nodes/44.js-CksJ0jbU.js')),
			__memo(() => import('./nodes/45.js-D-U7gaIH.js')),
			__memo(() => import('./nodes/46.js-BjEJ4eQX.js')),
			__memo(() => import('./nodes/47.js-CDn4FMWN.js')),
			__memo(() => import('./nodes/48.js-BfzBHXfc.js')),
			__memo(() => import('./nodes/49.js-DA5usJo9.js')),
			__memo(() => import('./nodes/50.js-HoKKzXoY.js')),
			__memo(() => import('./nodes/51.js--YFwwY70.js')),
			__memo(() => import('./nodes/52.js-C59yNeJr.js')),
			__memo(() => import('./nodes/53.js-GwPuf-Iw.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/api/auth/logout/_server.ts.js-DJ9umr-A.js'))
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/core",
				pattern: /^\/core\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/core/[coreId]",
				pattern: /^\/core\/([^/]+?)\/?$/,
				params: [{"name":"coreId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/core/[coreId]/[program]",
				pattern: /^\/core\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"coreId","optional":false,"rest":false,"chained":false},{"name":"program","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/csr-stories",
				pattern: /^\/csr-stories\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/docs/[slug]",
				pattern: /^\/docs\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/hub",
				pattern: /^\/hub\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/hub/admin",
				pattern: /^\/hub\/admin\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/hub/admin/analytics",
				pattern: /^\/hub\/admin\/analytics\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/hub/admin/api/media",
				pattern: /^\/hub\/admin\/api\/media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/hub/admin/api/media/_server.ts.js-DRU4aZ0M.js'))
			},
			{
				id: "/hub/admin/calendar",
				pattern: /^\/hub\/admin\/calendar\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/hub/admin/dashboard",
				pattern: /^\/hub\/admin\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/hub/admin/funding",
				pattern: /^\/hub\/admin\/funding\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/hub/admin/login",
				pattern: /^\/hub\/admin\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/hub/admin/media",
				pattern: /^\/hub\/admin\/media\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/hub/admin/notifications",
				pattern: /^\/hub\/admin\/notifications\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/hub/admin/notifications/new",
				pattern: /^\/hub\/admin\/notifications\/new\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/hub/admin/programs",
				pattern: /^\/hub\/admin\/programs\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/hub/admin/site",
				pattern: /^\/hub\/admin\/site\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/hub/admin/site/docs",
				pattern: /^\/hub\/admin\/site\/docs\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/hub/admin/site/docs/[slug]",
				pattern: /^\/hub\/admin\/site\/docs\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/hub/admin/site/home",
				pattern: /^\/hub\/admin\/site\/home\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/hub/admin/site/[section]",
				pattern: /^\/hub\/admin\/site\/([^/]+?)\/?$/,
				params: [{"name":"section","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/hub/admin/users",
				pattern: /^\/hub\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/notifications",
				pattern: /^\/notifications\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/setem",
				pattern: /^\/setem\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/society",
				pattern: /^\/society\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/society/events",
				pattern: /^\/society\/events\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/society/events/new",
				pattern: /^\/society\/events\/new\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/society/events/[id]",
				pattern: /^\/society\/events\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,], errors: [1,,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/society/funding",
				pattern: /^\/society\/funding\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/society/funding/new",
				pattern: /^\/society\/funding\/new\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/society/funding/[id]",
				pattern: /^\/society\/funding\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,], errors: [1,,], leaf: 52 },
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

export { manifest as m };
//# sourceMappingURL=manifest.js-Cek7lejD.js.map
