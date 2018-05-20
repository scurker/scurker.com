'use strict';

const cacheVersion = 'v1';
const pageCache = `${cacheVersion}-pages`;
const assetCache = `${cacheVersion}-assets`;

const cachedPages = [
  '/',
  '/about',
  '/offline'
];

const cachedAssets = [
  '/assets/images/profile.png',
  '/assets/fonts/NotoSans-Regular.woff2',
  '/assets/fonts/NotoSans-Bold.woff2',
  '/assets/global.css',
  '/pages.json'
];

addEventListener('install', event => {
  event.waitUntil(
    caches.open(assetCache).then(cache => {
      caches.open(pageCache).then(pagesCache => pagesCache.addAll(cachedPages));
      return cache.addAll(cachedAssets);
    })
  ).then(() => self.skipWaiting());
});

addEventListener('activate', () => {
  // clean up any old caches
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
    if(response && (response.ok || response.status === 302)) {
      caches.open(cachedPages).then(function(cache) {
        cache.put(request, response.clone());
      });
    }
    return response;
  }).catch(() => {
    return caches.match(request);
  }).then(response => {
    return response || caches.match('/offline');
  });
}