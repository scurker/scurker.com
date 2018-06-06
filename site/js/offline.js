const isOfflinePage = document.body.classList.contains('offline-page');

if (window.caches && isOfflinePage) {
  const cacheRegex = /-pages$/;
  const createElement = document.createElement.bind(document);
  const createTextNode = document.createTextNode.bind(document);
  const appendChild = (el, child) => el.appendChild(child);
  const createPostListItem = function(post) {
    let listItem = createElement('li')
      , anchor = createElement('a')
      , date = createElement('date')
      , title = createTextNode(post.title)
      , dateText = createTextNode(post.dateString);
    anchor.setAttribute('href', post.path);
    appendChild(date, dateText);
    appendChild(anchor, title);
    appendChild(anchor, date);
    appendChild(listItem, anchor);
    return listItem;
  };

  caches.keys()
    .then(keys => {
      let targetCache = keys.filter(cacheName => cacheRegex.test(cacheName));
      return Promise.all([
        caches.open(targetCache).then(c => c.keys()),
        fetch('/pages.json').then(res => res.json())
      ]);
    })
    .then(([ requests, pages ]) => {
      // here we'll match the requests in the cache against known posts
      let posts = pages.filter(({ type }) => type === 'post')
        , matchedPosts = posts.filter(post => requests.find(req => new URL(req.url).pathname.indexOf(post.path) !== -1));

      let offlineContainer = document.querySelector('.offline-posts');
      if(matchedPosts.length) {
        matchedPosts = matchedPosts.sort((a, b) => new Date(a.date) < new Date(b.date));
        // display offline posts on the page
        let list = document.querySelector('.posts');
        matchedPosts.forEach(post => {
          appendChild(list, createPostListItem(post));
        });
        appendChild(offlineContainer, list);
      } else {
        offlineContainer.remove();
      }
    });
}