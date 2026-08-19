// in dev, this makes Vite inject its client as this module's first dependency,
// so that global constant replacements are installed before any other module
// (including user hooks) evaluates. In build it's inert.
import.meta.hot;




export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39'),
	() => import('./nodes/40'),
	() => import('./nodes/41'),
	() => import('./nodes/42'),
	() => import('./nodes/43'),
	() => import('./nodes/44'),
	() => import('./nodes/45'),
	() => import('./nodes/46'),
	() => import('./nodes/47'),
	() => import('./nodes/48'),
	() => import('./nodes/49'),
	() => import('./nodes/50'),
	() => import('./nodes/51'),
	() => import('./nodes/52'),
	() => import('./nodes/53'),
	() => import('./nodes/54'),
	() => import('./nodes/55'),
	() => import('./nodes/56'),
	() => import('./nodes/57'),
	() => import('./nodes/58'),
	() => import('./nodes/59'),
	() => import('./nodes/60'),
	() => import('./nodes/61'),
	() => import('./nodes/62'),
	() => import('./nodes/63'),
	() => import('./nodes/64'),
	() => import('./nodes/65'),
	() => import('./nodes/66'),
	() => import('./nodes/67'),
	() => import('./nodes/68'),
	() => import('./nodes/69'),
	() => import('./nodes/70')
];

export const server_loads = [0,2,3,4];

export const dictionary = {
		"/": [~5],
		"/about": [~6],
		"/admin": [~7,[2]],
		"/admin/analytics": [~8,[2]],
		"/admin/calendar": [~9,[2]],
		"/admin/dashboard": [~10,[2]],
		"/admin/funding": [~11,[2]],
		"/admin/login": [~12],
		"/admin/media": [~13,[2]],
		"/admin/notifications/new": [~14,[2]],
		"/admin/programs": [~15,[2]],
		"/admin/site": [~16,[2]],
		"/admin/site/docs": [~18,[2]],
		"/admin/site/[section]": [~17,[2]],
		"/admin/users": [~19,[2]],
		"/asma": [20],
		"/auth/login": [~21],
		"/core": [~22],
		"/core/[coreId]": [~23],
		"/core/[coreId]/[program]": [~24],
		"/csr-stories": [~25],
		"/doa": [26],
		"/docs/[slug]": [~27],
		"/halaqah": [28],
		"/hub": [~29],
		"/hub/admin": [~30,[3]],
		"/hub/admin/analytics": [~31,[3]],
		"/hub/admin/calendar": [~32,[3]],
		"/hub/admin/dashboard": [~33,[3]],
		"/hub/admin/funding": [~34,[3]],
		"/hub/admin/login": [~35],
		"/hub/admin/media": [~36,[3]],
		"/hub/admin/notifications": [~37,[3]],
		"/hub/admin/notifications/new": [~38,[3]],
		"/hub/admin/programs": [~39,[3]],
		"/hub/admin/site": [~40,[3]],
		"/hub/admin/site/docs": [~42,[3]],
		"/hub/admin/site/docs/[slug]": [~43,[3]],
		"/hub/admin/site/home": [~44,[3]],
		"/hub/admin/site/[section]": [~41,[3]],
		"/hub/admin/users": [~45,[3]],
		"/ibadah": [46],
		"/khatam": [47],
		"/login": [~48],
		"/logout": [~49],
		"/mathurat": [50],
		"/mengaji": [51],
		"/mushaf": [52],
		"/notifications": [~53],
		"/puasa": [54],
		"/qibla": [55],
		"/search": [56],
		"/selawat": [57],
		"/setem": [~58],
		"/society": [~59,[4]],
		"/society/events": [~60,[4]],
		"/society/events/new": [~62,[4]],
		"/society/events/[id]": [~61,[4]],
		"/society/funding": [~63,[4]],
		"/society/funding/new": [~65,[4]],
		"/society/funding/[id]": [~64,[4]],
		"/solat": [66],
		"/surah": [67],
		"/yasin": [68],
		"/zakat": [69],
		"/zikir": [70]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';

export const get_error_template = () => import('../shared/error-template.js').then(m => m.default);