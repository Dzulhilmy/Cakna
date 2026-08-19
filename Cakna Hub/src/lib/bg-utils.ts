export function hasBg(images?: string[]): boolean {
	return Array.isArray(images) && images.some((img) => !!img?.trim());
}
