// public/sw.js
// VIVA ANALYSER - Offline PWA Service Worker
// Enables 100% offline operation on Mobile Phones & Tablets without any PC running.

const CACHE_NAME = 'viva-offline-cache-v2';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Install: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[VIVA SW] Precaching offline shell assets...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up older cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[VIVA SW] Deleting obsolete cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate & Offline-First Strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests and chrome-extension schemes
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // 1. Navigation requests (Opening pages / URLs):
  // Return cached index.html so SPA works 100% offline with zero server!
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // PC is off or phone is offline -> serve cached index.html
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Images, Fonts):
  // Serve from cache immediately for instant speed, and update cache in background
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse); // fallback to cache if network fails

      return cachedResponse || fetchPromise;
    })
  );
});
