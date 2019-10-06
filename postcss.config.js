module.exports = {
  plugins: [
    require('postcss-import')(),
    require('autoprefixer')(),
    require('postcss-nested')(),
    require('postcss-url')({ url: 'inline', basePath: '../', filter: '**/images/**/*.svg' }),
    require('cssnano'),
  ]
};