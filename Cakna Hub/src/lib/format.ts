export function formatRM(n: number): string {
	return 'RM ' + Math.round(n).toLocaleString('en-US');
}

export function formatCompactRM(n: number): string {
	const abs = Math.abs(n);
	if (abs >= 1_000_000) return 'RM ' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
	if (abs >= 1_000) return 'RM ' + Math.round(n / 1_000) + 'K';
	return 'RM ' + Math.round(n);
}
