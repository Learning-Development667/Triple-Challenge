// Triple Challenge — Service Worker
// Network-first: always fetches fresh, cache only as fallback
const CACHE = 'triple-challenge-v8';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Always go network-first
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Clone and cache the fresh response
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
