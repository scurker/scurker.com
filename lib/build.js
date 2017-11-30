import path from 'path';
import glob from 'glob';
import rimraf from 'rimraf';
import handlebars from 'handlebars';
import highlight from 'highlightjs';
import metalsmith from 'metalsmith';
import markdown from 'metalsmith-markdown';
import collections from 'metalsmith-collections';
import layouts from 'metalsmith-layouts';
import nested from 'metalsmith-nested';
import metadata from './metadata';
import permalinks from './permalinks';

// Configure Highlight.js
highlight.configure({ classPrefix: '' });
const hljs = (code, lang) => !lang ? highlight.highlightAuto(code).value : highlight.highlight(lang, code).value;

// Resolve Handlebars Helpers
glob(path.resolve(__dirname, '../templates/helpers/*.js'), (err, files) => {
  files.forEach(file => handlebars.registerHelper(path.basename(file, '.js'), require(file)));
});

metalsmith(path.resolve(__dirname, '../'))
  .source('site')
  .use(metadata({
    author: 'Jason Wilson',
    description: 'Jason Wilson (@scurker) a front-end engineer',
    url: 'https://scurker.com',
    name: 'scurker.com',
    env: process.env.NODE_ENV || 'dev'
  }))
  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown({
    highlight: hljs
  }))
  .use(permalinks())
  .use(nested({
    directory: 'templates',
    generated: 'compiled'
  }))
  .use(layouts({
    pattern: '**/*.html',
    engine: 'handlebars',
    directory: 'compiled',
    default: 'layout.hbs',
    partials: 'templates/partials'
  }))
  .build(err => {
    if(err) throw err;
    rimraf(path.resolve(__dirname, '../compiled'), err => err && console.log(err));
  });