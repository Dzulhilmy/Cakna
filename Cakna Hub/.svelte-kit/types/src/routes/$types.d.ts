import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageServerParentData = EnsureDefined<LayoutServerData>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/about" | "/admin" | "/admin/analytics" | "/admin/calendar" | "/admin/dashboard" | "/admin/funding" | "/admin/login" | "/admin/media" | "/admin/notifications/new" | "/admin/programs" | "/admin/site" | "/admin/site/[section]" | "/admin/site/docs" | "/admin/users" | "/asma" | "/auth/login" | "/core" | "/core/[coreId]" | "/core/[coreId]/[program]" | "/csr-stories" | "/doa" | "/docs/[slug]" | "/halaqah" | "/hub" | "/hub/admin" | "/hub/admin/analytics" | "/hub/admin/calendar" | "/hub/admin/dashboard" | "/hub/admin/funding" | "/hub/admin/login" | "/hub/admin/media" | "/hub/admin/notifications" | "/hub/admin/notifications/new" | "/hub/admin/programs" | "/hub/admin/site" | "/hub/admin/site/[section]" | "/hub/admin/site/docs" | "/hub/admin/site/docs/[slug]" | "/hub/admin/site/home" | "/hub/admin/users" | "/ibadah" | "/khatam" | "/login" | "/logout" | "/mathurat" | "/mengaji" | "/mushaf" | "/notifications" | "/puasa" | "/qibla" | "/search" | "/selawat" | "/setem" | "/society" | "/society/events" | "/society/events/[id]" | "/society/events/new" | "/society/funding" | "/society/funding/[id]" | "/society/funding/new" | "/solat" | "/surah" | "/yasin" | "/zakat" | "/zikir" | null
type LayoutParams = RouteParams & { section?: string | undefined; coreId?: string | undefined; program?: string | undefined; slug?: string | undefined; id?: string | undefined }
type LayoutServerParentData = EnsureDefined<{}>;
type LayoutParentData = EnsureDefined<{}>;

export type PageServerLoad<OutputData extends OutputDataShape<PageServerParentData> = OutputDataShape<PageServerParentData>> = Kit.ServerLoad<RouteParams, PageServerParentData, OutputData, RouteId>;
export type PageServerLoadEvent = Parameters<PageServerLoad>[0];
export type ActionData = unknown;
export type PageServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('./proxy+page.server.js').load>>>>>>;
export type PageData = Expand<Omit<PageParentData, keyof PageServerData> & EnsureDefined<PageServerData>>;
export type Action<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Action<RouteParams, OutputData, RouteId>
export type Actions<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Actions<RouteParams, OutputData, RouteId>
export type PageProps = { params: RouteParams; data: PageData; form: ActionData }
export type LayoutServerLoad<OutputData extends OutputDataShape<LayoutServerParentData> = OutputDataShape<LayoutServerParentData>> = Kit.ServerLoad<LayoutParams, LayoutServerParentData, OutputData, LayoutRouteId>;
export type LayoutServerLoadEvent = Parameters<LayoutServerLoad>[0];
export type LayoutServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('./proxy+layout.server.js').load>>>>>>;
export type LayoutData = Expand<Omit<LayoutParentData, keyof LayoutServerData> & EnsureDefined<LayoutServerData>>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;