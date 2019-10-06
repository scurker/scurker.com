import minimatch from 'minimatch';
import cheerio from 'cheerio';

export default function transformAnchorLinks() {
  return function(files) {
    Object.keys(files)
      .filter(file => minimatch(file, '**/*.html'))
      .forEach(file => {
        let contents = files[file].contents.toString()
          , $ = cheerio.load(contents)
          , anchors = $('h1,h2,h3,h4,h5,h6').filter('[id]');

        anchors.each((index, anchor) => {
          let $anchor = $(anchor)
            , id = $anchor.attr('id');
          $anchor.append(
            $(`<a class="anchor-link visually-hidden" aria-label="Permalink" aria-describedby="${id}"></a>`)
              .attr('href', `#${id}`)
          );
        });

        files[file].contents = Buffer.from($.html());
      });
  };
}