// Service Worker for TCB Softskills Lab PWA
const CACHE_NAME = 'tcb-softskills-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch handler required by Chrome for PWA installability
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
