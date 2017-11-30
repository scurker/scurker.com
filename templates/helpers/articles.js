module.exports = function(context) {
  let base = context.data.root
    , env = base.env
    , contents = base.contents;

  let result = '';
  env.helpers.getArticles(contents).forEach(article => {
    result += context.fn(article);
  });

  return result;
};