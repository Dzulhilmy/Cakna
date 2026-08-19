// All shared types for the Hub — roles, users, society, site content, etc.

// ─── Roles ───────────────────────────────────────────────────────────────────

export type Role = 'admin' | 'member' | 'franchisee' | 'pic' | 'reviewer';
export type UserStatus = 'active' | 'pending';

// ─── PIC Departments ─────────────────────────────────────────────────────────

export const PIC_DEPARTMENTS = [
	'Finance', 'MKTG', 'MI', 'BOD', 'FO', 'IT', 'QCXIS', 'RBE', 'Training', 'Logistic', 'Cakna'
] as const;
export type PicDepartment = (typeof PIC_DEPARTMENTS)[number];

// Core programme → which PIC departments get notified on approval
export const CORE_PIC_MAP: Record<string, PicDepartment[]> = {
	Assist:  ['Cakna'],
	Biz:     ['Finance', 'MKTG'],
	Circle:  ['MI', 'BOD', 'FO', 'Cakna'],
	Digital: ['IT', 'MKTG', 'QCXIS'],
	Edu:     ['RBE', 'Training', 'Cakna'],
	Future:  ['Training'],
	Green:   ['Logistic', 'MI', 'IT'],
};

export const ROLE_LABELS: Record<Role, string> = {
	admin: 'Admin',
	reviewer: 'Reviewer',
	pic: 'PIC',
	member: 'Member',
	franchisee: 'Franchisee'
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
	admin: 'Full access — Cakna HQ Admin',
	reviewer: 'HQ staff — funding review, analytics, announcements',
	pic: 'Department PIC — funding review, calendar',
	member: 'Hub Member',
	franchisee: 'Cakna Franchisee'
};

export function roleLabel(role: string): string {
	return (ROLE_LABELS as Record<string, string>)[role] ?? role;
}

// ─── Role permissions ────────────────────────────────────────────────────────

export type AdminFeature =
	| 'dashboard'
	| 'funding'
	| 'calendar'
	| 'analytics'
	| 'announcements'
	| 'programs'
	| 'website'
	| 'media'
	| 'users';

/** Returns true if the role can access the /hub/admin panel at all. */
export function canAccessAdmin(role: string): boolean {
	return role === 'admin' || role === 'reviewer' || role === 'pic';
}

/** Returns true if the role can access a specific admin feature. */
export function canAccessFeature(role: string, feature: AdminFeature): boolean {
	if (role === 'admin') return true;
	switch (feature) {
		case 'dashboard':
		case 'funding':
		case 'calendar':
			return role === 'reviewer' || role === 'pic';
		case 'analytics':
		case 'announcements':
			return role === 'reviewer';
		default:
			return false;
	}
}

/** Hub user — stored in data/users.json, matched to Cakna by email. */
export type HubUser = {
	id: string;
	name: string;
	email: string;
	role: Role;
	branch: string;
	status: UserStatus;
	createdAt: string;
};

// ─── Society ──────────────────────────────────────────────────────────────────

export type ReviewStatus = 'pending_dept' | 'pending_cakna' | 'approved' | 'needs_revision';
export type ReviewStage = 'dept' | 'cakna';

export const STATUS_LABELS: Record<string, string> = {
	pending_dept: 'Pending Department',
	pending_cakna: 'Pending CAKNA',
	approved: 'Approved',
	needs_revision: 'Needs Revision',
	pending: 'Pending Department'
};

export const STAGE_LABELS: Record<ReviewStage, string> = {
	dept: 'Department (PIC)',
	cakna: 'CAKNA (HQ)'
};

export function statusLabel(status: string): string {
	return STATUS_LABELS[status] ?? status;
}

export function normalizeStatus(status: string): ReviewStatus {
	switch (status) {
		case 'pending_dept':
		case 'pending_cakna':
		case 'approved':
		case 'needs_revision':
			return status;
		default:
			return 'pending_dept';
	}
}

export function stageForStatus(status: string): ReviewStage | null {
	const s = normalizeStatus(status);
	if (s === 'pending_dept') return 'dept';
	if (s === 'pending_cakna') return 'cakna';
	return null;
}

export function canActOnStage(role: string, stage: ReviewStage): boolean {
	if (stage === 'cakna') return role === 'admin';
	return role === 'reviewer' || role === 'pic' || role === 'admin';
}

export type ReviewEntry = {
	stage: ReviewStage | 'submit';
	decision: 'submitted' | 'approved' | 'needs_revision' | 'resubmitted';
	by: string;
	byRole: string;
	at: string;
	note: string;
};

export type Submitter = { id: string; name: string; role: string; branch: string };

export type FundingApplication = {
	id: string;
	reference: string;
	createdAt: string;
	submittedBy?: Submitter;
	status: ReviewStatus;
	reviewedBy?: { id: string; name: string };
	reviewedAt?: string;
	reviewNote?: string;
	reviewLog?: ReviewEntry[];
	cawangan: string;
	namaFrancaisi: string;
	ajk: string;
	kluster: string;
	namaProgram: string;
	tarikh: string;
	lokasi: string;
	penerangan: string;
	jumlahPeserta: string;
	kategoriPenerima: string;
	namaKomuniti: string;
	jumlahPerbelanjaan: number;
	sumberDana: string;
	pautanGambar: string;
	impak: string;
	cadangan: string;
};

export type EventRecord = {
	id: string;
	createdAt: string;
	submittedBy?: Submitter;
	title: string;
	kluster: string;
	tarikh: string;
	lokasi: string;
	anjuran: string;
	jumlahPeserta: string;
	penerangan: string;
	images: string[];
};

export type FundingInput = Omit<
	FundingApplication,
	'id' | 'reference' | 'createdAt' | 'status' | 'reviewedBy' | 'reviewedAt' | 'reviewNote' | 'reviewLog'
>;
export type EventInput = Omit<EventRecord, 'id' | 'createdAt'>;

// ─── Notices ─────────────────────────────────────────────────────────────────

export type NoticeAudience = 'dept' | 'cakna' | 'franchisee';
export type NoticeKind = 'approval_needed' | 'approved' | 'rejected';

export type Notice = {
	id: string;
	createdAt: string;
	audience: NoticeAudience;
	userId?: string;
	kind: NoticeKind;
	title: string;
	body: string;
	href?: string;
	readBy: string[];
};

export type NoticeInput = Omit<Notice, 'id' | 'createdAt' | 'readBy'>;
export type NoticeView = Omit<Notice, 'readBy'> & { read: boolean };

export function audienceForRole(role: Role): NoticeAudience {
	if (role === 'admin') return 'cakna';
	if (role === 'reviewer' || role === 'pic') return 'dept';
	return 'franchisee';
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType = 'kemalangan' | 'takziah' | 'kesihatan' | 'umum';

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
	kemalangan: 'Accident',
	takziah: 'Condolences',
	kesihatan: 'Health Announcement',
	umum: 'General Announcement'
};

export type CaknaNotification = {
	id: string;
	createdAt: string;
	type: NotificationType;
	title: string;
	content: string;
	callout: string;
	audience: string;
	createdBy?: { id: string; name: string };
};

export type NotificationInput = Omit<CaknaNotification, 'id' | 'createdAt'>;

// ─── Site content (subset of types needed by components) ─────────────────────

export type CtaLink = { label: string; href: string };
export type NavLink = { label: string; href: string };
export type Stat = { value: string; label: string };
export type LabeledText = { title: string; desc: string };
export type OverlayStrength = 'light' | 'medium' | 'dark';
export type PageKey = 'home' | 'about' | 'setem' | 'csr';
export type SectionBlockType = 'paragraph' | 'text' | 'image' | 'bulletList';

export type SectionBlock = {
	id: string;
	type: SectionBlockType;
	content?: string;
	images?: string[];
	imageStyle?: 'gallery' | 'background' | 'both';
	caption?: string;
	items?: string[];
};

export type CustomSection = {
	id: string;
	background: 'white' | 'tint';
	eyebrow?: string;
	title: string;
	blocks: SectionBlock[];
	ctaLabel?: string;
	ctaHref?: string;
};

export type DocPage = {
	title: string;
	subtitle: string;
	content: string;
	lastUpdated: string;
};

export type Story = {
	title: string;
	date: string;
	category: string;
	excerpt: string;
	cover?: string;
	images?: string[];
};

// ─── Cores ───────────────────────────────────────────────────────────────────

export type Core = {
	id: string;
	name: string;
	tagline: string;
	programs: string[];
	pic: string[];
	icon: string;
};

export type Program = {
	id: string;
	coreId: string;
	name: string;
	slug: string;
	description: string;
	image: string;
	createdAt: string;
	updatedAt: string;
};
