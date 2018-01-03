import minimatch from 'minimatch';

export default function() {
  return function(files) {
    Object.keys(files)
      .filter(file => minimatch(file, 'posts/*.html'))
      .forEach(file => {
        let data = files[file];
        data.layout = 'post';
      });
  }
}