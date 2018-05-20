import minimatch from 'minimatch';
import cheerio from 'cheerio';

export default function transformAnchorLinks() {
  return function(files) {
    Object.keys(files)
      .filter(file => minimatch(file, '**/*.html'))
      .forEach(file => {
        let contents = files[file].contents.toString()
          , $ = cheerio.load(contents)
          , anchors = $('h2,h3,h4,h5,h6').filter('[id]');

        anchors.each((index, anchor) => {
          let $anchor = $(anchor);
          $anchor.prepend(
            $('<a class="anchor-link" aria-hidden="true"></a>')
              .attr('href', `#${$anchor.attr('id')}`)
          );
        });

        files[file].contents = new Buffer($.html());
      });
  };
}