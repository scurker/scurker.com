'use strict';

var minimatch = require('minimatch');

module.exports = function(pattern, layout) {
  let matcher = x => minimatch(x, pattern);

  return function(files, metalsmith) {
    let metadata = metalsmith.metadata()
      , collection = [];

    Object.keys(files)
      .filter(matcher)
      .forEach(file => {
        files[file].layout = layout;
        collection.push(files[file]);
      });

    collection.sort((a, b) => b.date - a.date);

    metadata.posts = collection;
  };
};