const CACHE_NAME = 'planche-ref-v1.0.1.7';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './pdf_templates.js',
    './logo.png',
    './icon-v1.png',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    'https://unpkg.com/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.js'
];

// Installation : met en cache les fichiers pour le mode hors-ligne
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activation : nettoie les anciens caches si la version change
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interception : Stratégie "Network-First" (Essaie le web d'abord, sinon prend le cache)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Si on a du réseau, on met à jour le cache en arrière-plan et on retourne le nouveau
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // Si on est hors-ligne, on sert le fichier depuis le cache local
                return caches.match(event.request);
            })
    );
});