/** Pure utility — no client-side code, safe to import in server and client components. */
export function hasBg(images?: string[]): boolean {
  return Array.isArray(images) && images.some((img) => !!img?.trim());
}
