'use strict';

var path = require('path')
  , glob = require('glob')
  , path = require('path')
  , metalsmith = require('metalsmith')
  , handlebars = require('handlebars')
  , posts = require('./posts')
  , pagination = require('./pagination')
  , markdown = require('metalsmith-markdown')
  , permalinks = require('metalsmith-permalinks')
  , layouts = require('metalsmith-layouts');

// Resolve Handlebars Helpers
glob(path.resolve(__dirname, '../templates/helpers/*.js'), (err, files) => {
  files.forEach(file => handlebars.registerHelper(path.basename(file, '.js'), require(file)));
});

metalsmith(path.resolve(__dirname, '../'))
  .source('site')
  .use((files, metalsmith) => {
    var metadata = metalsmith.metadata();
    Object.assign(metadata, {
      author: 'Jason Wilson',
      description: 'Jason Wilson (@scurker) a front-end engineer',
      url: 'http://scurker.com',
      name: 'scurker.com',
    });
  })
  .use(posts('posts/*.md', 'post.hbs'))
  .use(pagination())
  .use(permalinks(':title/index.html'))
  .use(markdown())
  .use(layouts({
    pattern: '**/*.html',
    engine: 'handlebars',
    directory: 'templates',
    default: 'layout.hbs',
    partials: 'templates/partials'
  }))
  .build(err => {
    if(err) throw err;
  });