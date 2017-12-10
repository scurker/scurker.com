import fs from 'fs';
import path from 'path';
import glob from 'glob';
import handlebars from 'handlebars';
import minimatch from 'minimatch';

// {{!< layout }}
var layoutPattern = /{{!<\s+([A-Za-z0-9._\-/]+)\s*}}/;

export default function({ pattern = '**/*.html', layouts = 'layouts', partials = 'partials', layoutExtension = 'hbs', defaultLayout = null }) {
  return function(files, metalsmith, done) {

    let cachedLayouts = {}
      , metadata = metalsmith.metadata()
      , rootDirectory = metalsmith._directory
      , layoutsDirectory = path.resolve(rootDirectory, layouts || '');

    function resolveLayoutPath(layoutName) {
      return path.resolve(layoutsDirectory, `${layoutName}.${layoutExtension}`);
    }

    function resolveParentLayout(str) {
      let matches = str.match(layoutPattern);
      if(matches) {
        let [ , layout ] = matches;
        return resolveLayoutPath(layout);
      }
    }

    function layoutFromFile(layoutFile) {
      return fs.readFileSync(layoutFile, 'utf-8');
    }

    function render(layoutPath, data) {
      let layoutFile = layoutFromFile(layoutPath)
        , parentLayout = resolveParentLayout(layoutFile)
        , compiledLayout = cachedLayouts[layoutFile];

      if(!compiledLayout) {
        compiledLayout = handlebars.compile(layoutFile);
        cachedLayouts[layoutFile] = compiledLayout;
      }

      let compiledTemplate = compiledLayout(data);

      if(parentLayout) {
        return render(parentLayout, { ...data, contents: compiledTemplate });
      }

      return compiledTemplate;
    }

    // Register handlebars partials
    let partialFiles = glob.sync(path.resolve(rootDirectory, partials, '*.hbs'));
    partialFiles.forEach(partial => handlebars.registerPartial(path.basename(partial, '.hbs'), fs.readFileSync(partial, 'utf-8')));

    Object.keys(files)
      .filter(file => minimatch(file, pattern))
      .forEach(file => {
        let data = files[file]
          , layout = data.layout || defaultLayout
          , layoutPath = resolveLayoutPath(layout)
          // eslint-disable-next-line no-unused-vars
          , { mode, stats, ...rest } = data // exclude metalsmith specific data
          , mergedData = { ...metadata, ...rest };

        const contents = render(layoutPath, mergedData);

        files[file].contents = new Buffer(contents);
      });

    setImmediate(done);
  };
}
