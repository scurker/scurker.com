'use strict';

const cacheVersion = CACHE_VERSION || 'v1';
const pageCache = `${cacheVersion}-pages`;
const assetCache = `${cacheVersion}-assets`;

// Pre-cache pages
const cachedPages = [
  '/',
  '/about',
  '/offline'
];

// Pre-cache assets (generated from build/assets/*)
const cachedAssets = STATIC_ASSETS;

addEventListener('install', event => {
  event.waitUntil(
    caches.open(assetCache).then(cache => {
      caches.open(pageCache).then(pagesCache => pagesCache.addAll(cachedPages));
      return cache.addAll(cachedAssets);
    })
    .then(() => self.skipWaiting())
  );
});

// On activate, remove any old caches
addEventListener('activate', () => {
  return caches.keys().then(keys => {
    return Promise.all(keys
      .filter(key => key.indexOf(cacheVersion) !== 0)
      .map(key => caches.delete(key))
    );
  });
});

addEventListener('fetch', event => {
  let request = event.request;

  if(request.method !== 'GET' || request.url.indexOf('?') !== -1) {
    return;
  }

  event.respondWith(networkFirst(event.request));
});

function networkFirst(request) {
  return fetch(request).then(response => {
    let res = response.clone();
    if(res && (res.ok || res.status === 302)) {
      caches.open(pageCache).then(function(cache) {
        cache.put(request, res);
      });
    }
    return response;
  }).catch(() => {
    return caches.match(request);
  }).then(response => {
    return response || caches.match('/offline');
  });
}