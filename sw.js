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

// ---- DEV MODE — no caching, always fetch fresh ----
// TODO: On Day 7 before submission, remove this line and restore full caching below
self.addEventListener('fetch', e => e.respondWith(fetch(e.request)));

// ---- PRODUCTION caching (restore on Day 7) ----
// self.addEventListener('install', e => {
//   e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
// });
// self.addEventListener('activate', e => {
//   e.waitUntil(caches.keys().then(keys =>
//     Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
//   ).then(() => self.clients.claim()));
// });
// self.addEventListener('fetch', e => {
//   e.respondWith(caches.match(e.request).then(cached => {
//     if (cached) return cached;
//     return fetch(e.request).then(response => {
//       const clone = response.clone();
//       caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
//       return response;
//     }).catch(() => caches.match('/index.html'));
//   }));
// });
