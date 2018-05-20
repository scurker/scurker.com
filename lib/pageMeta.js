import minimatch from 'minimatch';

export default function pageMeta() {
  return function(files) {
    let pageMeta = Object.keys(files)
      .filter(file => minimatch(file, '**/*.html'))
      .map(file => {
        let meta = files[file]
          , type = 'page'
          , { title, date, path } = meta;

        if(path === 'index.html') {
          return null;
        }

        if(meta.collections && meta.collections.includes('post')) {
          type = 'post';
        }

        if(path === '.') {
          path = file.replace('.html', '');
        }

        return { title, date, path: `/${path}`, type };
      });

    files['pages.json'] = {};
    files['pages.json'].contents = new Buffer(JSON.stringify(pageMeta.filter(Boolean)));
  };
}