const isOfflinePage = document.body.classList.contains('offline-page');

if (window.caches && isOfflinePage) {
  const cacheRegex = '/-pages$/';

  caches.keys
    .then(keys => {
      let targetCache = keys.filter(cacheName => cacheRegex.test(cacheName));
      return [caches.open(targetCache).keys()];
    })
    .then(requests => {
      // here we'll match the requests in the cache against known posts
    });
}