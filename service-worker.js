// Service Worker temporarily disabled to fix Firebase issues
// This will be re-enabled once Firebase connection is stable

const CACHE_NAME = 'steps-tracker-v5';

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  return self.clients.claim();
});

// Completely disable fetch interception to prevent Firebase issues
self.addEventListener('fetch', event => {
  // Don't intercept ANY requests - let them go directly to the network
  return;
});