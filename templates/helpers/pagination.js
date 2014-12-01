var _ = require('underscore')
  , fs = require('fs')
  , path = require('path')
  , hbs = require('handlebars');

module.exports = function(context) {
  var base = context.data.root
    , page = base.page
    , env = base.env
    , contents = base.contents
    , articles = env.helpers.getArticles(contents);

  var titles = _.map(articles, function(article) {
    return article.metadata.title;
  });

  var index = titles.indexOf(page.title)
    , prev = articles[index-1]
    , next = articles[index+1];

  var file = fs.readFileSync(path.resolve(__dirname, '../pagination.hbs'), 'utf-8')
    , template = hbs.compile(file)
    , result = template({
        pagination: prev || next,
        prev: prev,
        next: next
      });

  return result;

};