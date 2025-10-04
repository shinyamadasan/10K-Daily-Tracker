 const CACHE_NAME = 'steps-tracker-v2';
  const urlsToCache = [
    '/10K-Daily-Tracker/',
    '/10K-Daily-Tracker/index.html',
    '/10K-Daily-Tracker/app.js',
    '/10K-Daily-Tracker/style.css'
  ];

  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
  });

  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  });