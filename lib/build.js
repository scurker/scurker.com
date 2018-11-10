import path from 'path';
import glob from 'glob';
import handlebars from 'handlebars';
import highlight from 'highlight.js';
import metalsmith from 'metalsmith';
import ignore from 'metalsmith-ignore';
import drafts from 'metalsmith-drafts';
import markdown from 'metalsmith-markdown';
import collections from 'metalsmith-collections';
import permalinks from 'metalsmith-perma';
import twitterEmbed from './twitterEmbed';
import anchorLinks from './anchorLinks';
import postLayout from './postLayout';
import layout from './layout';
import pageMeta from './pageMeta';

// Configure Highlight.js
highlight.configure({ classPrefix: '' });
const hljs = (code, lang) => !lang ? highlight.highlightAuto(code).value : highlight.highlight(lang, code).value;

// Resolve Handlebars Helpers
glob(path.resolve(__dirname, '../templates/helpers/*.js'), (err, files) => {
  files.forEach(file => handlebars.registerHelper(path.basename(file, '.js'), require(file)));
});

metalsmith(path.resolve(__dirname, '../'))
  .source('site')
  .use(ignore('js/*'))
  .use(drafts())
  .metadata({
    author: 'Jason Wilson',
    description: 'Jason Wilson (@scurker) a front-end engineer',
    url: 'https://scurker.com',
    name: 'scurker.com',
    env: process.env.NODE_ENV || 'dev'
  })
  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(twitterEmbed())
  .use(markdown({
    highlight: hljs
  }))
  .use(anchorLinks())
  .use(postLayout())
  .use(permalinks({
    match: { collection: ['posts'] },
    pattern: ':title'
  }))
  .use(layout({
    pattern: '**/*.html',
    layouts: 'templates',
    defaultLayout: 'layout',
    partials: 'templates/partials'
  }))
  .use(pageMeta('pages.json'))
  .build(err => {
    // eslint-disable-next-line curly
    if(err) throw err;
  });