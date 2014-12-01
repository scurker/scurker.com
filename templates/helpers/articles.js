module.exports = function(context) {
  var base = context.data.root
    , env = base.env
    , contents = base.contents;

  var result = "";
  env.helpers.getArticles(contents).forEach(function(article) {
    result += context.fn(article);
  });

  return result;
};