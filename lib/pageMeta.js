import minimatch from 'minimatch';
import moment from 'moment';

export default function pageMeta(name) {
  return function(files) {
    let pageMeta = Object.keys(files)
      .filter(file => minimatch(file, '**/*.html'))
      .map(file => {
        let meta = files[file]
          , type = 'page'
          , { title, date, path } = meta
          // eslint-disable-next-line no-undefined
          , dateString = typeof date !== 'undefined' ? moment.utc(date).format('MMM YYYY') : undefined;

        if(file === 'index.html') {
          return null;
        }

        if(meta.collection && meta.collection.includes('posts')) {
          type = 'post';
        }

        if(path === '.') {
          path = file.replace('.html', '');
        }

        return { title, date, dateString, path: `/${path}`, type };
      });

    files[name] = {};
    files[name].contents = Buffer.from(JSON.stringify(pageMeta.filter(Boolean)));
  };
}