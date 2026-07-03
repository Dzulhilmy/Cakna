/* =========================================================
   Nur Al-Quran — Service Worker (PWA)
   Strategi:
   - Cangkerang aplikasi (HTML/manifest/ikon): pra-cache, cache-first
   - Font Google: cache-first (kekal luar talian selepas muat pertama)
   - Audio qari (cdn.islamic.network): stale-while-revalidate terhad
   - Teks Al-Quran sudah terbenam dalam HTML — automatik luar talian
========================================================= */
const VERSION = "nur-al-quran-v25";
const SHELL_CACHE = VERSION + "-shell";
const FONT_CACHE = VERSION + "-fonts";
const AUDIO_CACHE = VERSION + "-audio";
const AUDIO_LIMIT = 300; /* had bilangan fail audio dalam cache (~ beberapa juzuk) */

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/icon-180.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL_CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

async function trimCache(name, limit) {
  const c = await caches.open(name);
  const keys = await c.keys();
  if (keys.length > limit) {
    await c.delete(keys[0]);
    return trimCache(name, limit);
  }
}

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  /* Cangkerang aplikasi: cache-first, kemas kini di latar */
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true }).then((hit) => {
        const net = fetch(e.request).then((res) => {
          if (res.ok) caches.open(SHELL_CACHE).then((c) => c.put(e.request, res.clone()));
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  /* Font Google: cache-first */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
        if (res.ok) caches.open(FONT_CACHE).then((c) => c.put(e.request, res.clone()));
        return res;
      }))
    );
    return;
  }

  /* Audio qari: stale-while-revalidate dengan had saiz */
  if (url.hostname === "cdn.islamic.network") {
    e.respondWith(
      caches.match(e.request).then((hit) => {
        const net = fetch(e.request).then((res) => {
          if (res.ok) caches.open(AUDIO_CACHE).then((c) => {
            c.put(e.request, res.clone());
            trimCache(AUDIO_CACHE, AUDIO_LIMIT);
          });
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
  }
});
