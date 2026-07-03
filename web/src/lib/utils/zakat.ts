// Zakat calculator — port of the sample (index.html L2903+).
// Rate 2.5%; nisab = 85 g × user-entered gold price (RM/g, default 480).
export const ZAKAT_RATE = 0.025;
export const NISAB_GRAMS = 85;
export const DEFAULT_GOLD_PRICE = 480;

export interface ZakatResult {
	due: number | null; // null = below nisab
	nisab: number;
	monthly?: number; // income mode: due / 12
}

export function zakatIncome(monthlyIncome: number, goldPrice: number): ZakatResult {
	const nisab = NISAB_GRAMS * goldPrice;
	const yearly = Math.max(0, monthlyIncome) * 12;
	if (yearly < nisab) return { due: null, nisab };
	const due = yearly * ZAKAT_RATE;
	return { due, nisab, monthly: due / 12 };
}

export function zakatSavings(amount: number, goldPrice: number): ZakatResult {
	const nisab = NISAB_GRAMS * goldPrice;
	if (Math.max(0, amount) < nisab) return { due: null, nisab };
	return { due: amount * ZAKAT_RATE, nisab };
}

/** Gold mode: due when weight >= 85 g (weight nisab, not value). */
export function zakatGold(grams: number, goldPrice: number): ZakatResult {
	const nisab = NISAB_GRAMS * goldPrice;
	if (Math.max(0, grams) < NISAB_GRAMS) return { due: null, nisab };
	return { due: grams * goldPrice * ZAKAT_RATE, nisab };
}

export function fmtRM(n: number): string {
	return (
		'RM ' + n.toLocaleString('ms-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
	);
}
