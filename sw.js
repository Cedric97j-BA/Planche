self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('planche-store-v3').then((cache) => cache.addAll([
      './',
      './index.html',
      './manifest.json',
      './icon-v1.png'
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});