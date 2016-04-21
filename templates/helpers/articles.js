'use strict';

module.exports = function(context) {
  var base = context.data.root
    , env = base.env
    , contents = base.contents;

  var result = '';
  env.helpers.getArticles(contents).forEach(article => {
    result += context.fn(article);
  });

  return result;
};