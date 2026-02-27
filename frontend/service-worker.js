const CACHE_NAME = 'agrifresh-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/inventory.html',
  '/analytics.html',
  '/trace.html',
  '/css/style.css',
  '/js/inventory.js',
  '/js/charts.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://unpkg.com/aos@next/dist/aos.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
