// ===========================
// SARAL — sw.js (Service Worker)
// Enables offline mode for rural users
// ===========================

const CACHE_NAME = 'saral-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/form.html',
  '/styles/main.css',
  '/styles/modes.css',
  '/js/app.js',
  '/js/form-engine.js',
  '/js/voice.js',
  '/js/scam-guard.js',
  '/js/ai.js',
  '/lang/strings.js',
  '/data/forms.json',
  '/manifest.json'
];

// Install — cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — serve from cache first, then network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(response => {
          // Cache new requests dynamically
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html')); // Fallback to index
    })
  );
});
