import replace from 'rollup-plugin-replace';
import path from 'path';
import glob from 'glob';

const dest = 'build';

export default {
  input: 'site/sw.js',
  plugins: [
    replace({
      CACHE_VERSION: JSON.stringify(new Date().toISOString().split('T')[0].replace(/-/g, '')),
      STATIC_ASSETS: JSON.stringify([
        ...glob.sync('assets/**/*', {
            cwd: path.resolve(__dirname, dest),
            nodir: true,
            ignore: '**/*.{ttf,woff}' // if browser supports workers, it supports woff2
          }).map(file => `/${file}`),
        '/pages.json'
      ], null, 2)
    })
  ],
  output: {
    file: `${dest}/sw.js`,
    format: 'iife'
  }
};