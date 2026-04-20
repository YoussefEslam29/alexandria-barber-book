self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('kral-store').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/kral-logo.png'
    ])),
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
