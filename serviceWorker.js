var DYNAMIC_CACHE = 'v20240311-1148';

var urlsToCache = [
    'index.html',
    'css/style.css',
    'css/snackbar.css',
    'src/engine.js',
    'src/eventListeners.js',
    'src/input.js',
    'src/object3D.js',
    'src/scenario.js',
    'src/app/appManager.js',
    'res/cockpit.png',
    'res/mira.png',
    'res/nuvem.png',
    'res/pedra2.png',
];

self.addEventListener ('install', function (event) {
    self.skipWaiting ();
    event.waitUntil (
        caches.open (DYNAMIC_CACHE)
        .then (function (cache) {
            console.log ('Opened cache');
            return cache.addAll (urlsToCache);
        })
    );
});

self.addEventListener('message', function (event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting ();
    }
});

self.addEventListener ('fetch', (event) => {
    event.respondWith ((async () => {
        const cachedResponse = await caches.match (event.request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const response = await fetch (event.request);

        if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
        }

        if (urlsToCache) {
            const responseToCache = response.clone ();
            const cache = await caches.open (DYNAMIC_CACHE)
            await cache.put (event.request, response.clone ());
        }

        return response;
    }) ());
})

self.addEventListener('activate', (event) => {
    event.waitUntil ((async () => {
        const cacheNames = await caches.keys();

        await Promise.all (cacheNames.map (async (cacheName) => {
            if (self.cacheName !== cacheName) {
                await caches.delete (cacheName);
            }
        }));
    }) ());
});
