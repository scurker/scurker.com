import minimatch from 'minimatch';
import got from 'got';

const TWEET_REGEX = /https?:\/\/(www\.)?twitter\.com\/[a-z0-9_]{1,15}\/status(es)?\/[0-9]+/ig;

export default function twitterEmbed(options = { align: 'center' }) {
  return function(files, metalsmith, done) {
    Object.keys(files)
      .filter(file => minimatch(file, '**/*.md'))
      .forEach(file => {
        let contents = files[file].contents.toString()
          , matches = contents.match(TWEET_REGEX);

        if(matches && matches.length > 0) {
          matches.forEach(async status => {
            try {
              let oembedURL = `https://publish.twitter.com/oembed?omit_script=1&align=${options.align}&dnt=1&url=${status}`
                , response = await got(oembedURL, { json: true });
              if(response.body && response.body.html) {
                files[file].contents = new Buffer(contents.replace(status, response.body.html));
              }
              done();
            } catch (ex) {
              done();
            }
          });
        }
      });
  };
}