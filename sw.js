// Triple Challenge — Service Worker
// Network-first: always fetch fresh from the network, fall back to cache only
// when the network is unavailable (offline).
const CACHE = 'triple-challenge-v22';

// Activate the new service worker immediately, without waiting for old tabs.
self.addEventListener('install', () => self.skipWaiting());

// On activate, drop any caches that aren't the current version, then take
// control of open pages so updates apply right away.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Network-first for same-origin GET requests. Non-GET (e.g. API writes) and
// cross-origin requests (fonts, the data API) bypass the service worker and go
// straight to the network so they are never served from a stale cache.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return; // let the browser handle it normally
  }

  e.respondWith(
    fetch(req)
      .then(response => {
        // Cache a clone of the fresh response for offline fallback.
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(req))
  );
});
