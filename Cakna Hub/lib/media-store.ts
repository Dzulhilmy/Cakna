// Server-only media library: lists and deletes images under /public/uploads.
// Uploads are handled by /api/site/upload; this store manages the collection.
import { promises as fs } from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
]);

export type MediaItem = {
  name: string;
  url: string;
  size: number;
  modified: string;
};

function isImage(name: string): boolean {
  return IMAGE_EXT.has(path.extname(name).toLowerCase());
}

/** All images in the uploads folder, newest first. */
export async function listMedia(): Promise<MediaItem[]> {
  let names: string[];
  try {
    names = await fs.readdir(UPLOADS_DIR);
  } catch {
    return [];
  }

  const items: MediaItem[] = [];
  for (const name of names) {
    if (!isImage(name)) continue;
    try {
      const stat = await fs.stat(path.join(UPLOADS_DIR, name));
      if (!stat.isFile()) continue;
      items.push({
        name,
        url: `/uploads/${name}`,
        size: stat.size,
        modified: stat.mtime.toISOString(),
      });
    } catch {
      // Skip entries we can't stat.
    }
  }

  items.sort((a, b) => (a.modified < b.modified ? 1 : -1));
  return items;
}

/**
 * Delete one image by bare filename. Rejects anything that isn't a plain image
 * filename living directly in the uploads folder (no path traversal).
 */
export async function deleteMedia(name: string): Promise<boolean> {
  if (typeof name !== "string" || !name) return false;
  const base = path.basename(name);
  if (base !== name || !isImage(base)) return false;

  const target = path.join(UPLOADS_DIR, base);
  const resolved = path.resolve(target);
  if (path.dirname(resolved) !== path.resolve(UPLOADS_DIR)) return false;

  try {
    await fs.unlink(resolved);
    return true;
  } catch {
    return false;
  }
}
