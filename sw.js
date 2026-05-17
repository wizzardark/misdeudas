var CACHE = 'misdeudas-v2';
var FILES = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap'
];

// Instalar: guarda todos los archivos en caché
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

// Activar: borra cachés viejas
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: sirve desde caché, si no hay red usa lo guardado
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        var copy = response.clone();
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, copy);
        });
        return response;
      }).catch(function() {
        return caches.match('./index.html');
      });
    })
  );
});
