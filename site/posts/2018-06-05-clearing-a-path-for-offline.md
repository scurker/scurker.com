---
title: "Clearing a Path for Offline"
date: 2018-06-05
---

I've long known the benefits of service workers, but had not made the push to implement one for my own site. With the recent [change in Safari](https://webkit.org/blog/8090/workers-at-your-service/) finally taking service workers to task, it was time to hop aboard the service worker train myself. Now if you visit my site, select pages will be available with offline viewing.

As of [June 2018](https://caniuse.com/#feat=serviceworkers), 83% of global users have some form of service worker support so there's little reason not to have one especially as mobile connectivity becomes more pervasive. If you've made it this far and still don't know what a service worker is, [Google has an excellent primer](https://developers.google.com/web/fundamentals/primers/service-workers/) all about the inner workings of service workers.

## A worker to build

I build my blog on top of [metalsmith](http://www.metalsmith.io/), and there was a couple of key aspects I wanted to build into my service worker:

* Increment cache version for each static site build
* Have my service worker automatically include built static assets
* Have my offline page list previously visited offline pages

I am not going to suggest the path that I took towards the end result is one that should be similarly followed, but wanted to outline the steps that led me there.

### Versioning

Whenever a service worker changes, a new version is downloaded and installed. To ensure that the browser's cache is up to date we want the service worker to have a new version key to be able to clear out older requests.

My static site doesn't change frequently, so having a cache version based on date seems relatively safe. Using [rollup](https://www.npmjs.com/package/rollup) in combination with [rollup-plugin-replace](https://www.npmjs.com/package/rollup-plugin-replace) I can replace `CACHE_VERSION` with the current date's version string.

```
replace({
  CACHE_VERSION: JSON.stringify(
    new Date().toISOString().split('T')[0].replace(/-/g, '')
  )
})
```

### Including Assets

Similarly to versioning above, I utilize rollup to scan my assets folder to match static assets and replace `STATIC_ASSETS` with the array of assets to pre-cache in the service worker on install.

```
replace({
  STATIC_ASSETS: JSON.stringify([
    ...glob.sync('assets/**/*', {
        cwd: path.resolve(__dirname, 'build'),
        nodir: true
      }).map(file => `/${file}`)
  ], null, 2)
})
```

### Listing offline posts

For listing offline posts, I'm utilizing [metalsmith middleware](https://www.npmjs.com/package/metalsmith#useplugin) to generate [json metadata](https://scurker.com/pages.json) about my site to pre-cache in my service worker to later compare cached requests against known pages. I could just list visited offline posts by their url, but by generating and pre-caching metadata about any particular page, I can include page titles and dates to list [/offline](/offline).

```js
const isOfflinePage = document.body.classList.contains('offline-page');
if (window.caches && isOfflinePage) {
  caches.keys()
    .then(keys => {
      return Promise.all([
        caches.open(targetCache).then(c => c.keys()),
        fetch('/pages.json').then(res => res.json())
      ]);
    })
    .then(([ requests, pages ]) => {
      // match the requests in the cache against known posts
      let posts = pages.filter(({ type }) => type === 'post')
        , matchedPosts = posts.filter(
            post => requests.find(req =>
              new URL(req.url).pathname.indexOf(post.path) !== -1)
          );

      let offlineContainer = document.querySelector('.offline-posts');
      if(matchedPosts.length) {
        // display offline posts on the page
      } else {
        offlineContainer.remove();
      }
    });
}
```

## There are many service workers – this one is mine

Beyond the methods outline above, my service worker isn't a particularly specialized affair. Following patterns from [Jake Archibald's offline cookbook](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook), [pre-caches assets on install](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#on-install-not), [removes old caches on activate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#on-activate), and serving content with a [network first with cache fallback](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache) pattern.

For a full picture, you can view my service worker scripts below.

* [`sw.js`](https://github.com/scurker/scurker.com/blob/master/site/sw.js) *prebuild*
* [`sw.js`](https://scurker.com/sw.js) *postbuild*
* [`rollup.sw.config.js`](https://github.com/scurker/scurker.com/blob/master/rollup.sw.config.js)

## Thoughts to improve

These are only my first steps towards a path for offline, but there are certain areas of improvement I could see. Service worker asset responses could follow a [cache with network fallback](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network) recipe since my assets aren't likely to change frequently. Or, if I was to uniquely identify assets with some sort of asset hash could place assets into a more permanent cache only expiring assets if a new version is received.