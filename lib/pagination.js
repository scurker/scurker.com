'use strict';

module.exports = function() {
  return function(files, metalsmith) {
    var posts = metalsmith.metadata().posts
      , titles = posts.map(post => post.title);

    // titles.forEach(title => {
    //   let index = posts.indexOf(title)
    //     , post = posts[index];
    //   Object.assign(post, {
    //     pagination: true,
    //     next: posts[index + 1],
    //     previous: posts[index - 1]
    //   });
    // });
  };
};