module.exports = {
  plugins: [
    require('autoprefixer')({ browsers: ['last 2 versions'] }),
    require('cssnano'),
    require('postcss-url')({ url: 'inline', basePath: '../', filter: '**/images/badges/*.png' })
  ]
};