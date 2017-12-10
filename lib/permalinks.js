import s from 'slug';
import minimatch from 'minimatch';
import path from 'path';

const slug = string => s(string, { lower: true });

export default function() {
  return function(files) {
    Object.keys(files)
      .filter(file => minimatch(file, 'posts/*.html'))
      .forEach(file => {
        let data = files[file]
          , parts = path.basename(file, '.html').split('/').slice(0, -1)
          , slugged = parts.reduce((a, b) => `${a}/${slug(b)}`, '');

        let sluggedPath = `${slugged}/${slug(data.title)}`;

        // Add path for collection information
        data.path = sluggedPath;

        // Set default layout
        data.layout = 'post';

        // Replace with new slugged path
        files[`${sluggedPath.substring(1)}/index.html`] = files[file];
        delete files[file];
      });
  };
}
