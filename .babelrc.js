let babelEnvPresetOptions = { targets: { node: 'current' }};
if(process.env.BABEL_ENV === 'rollup') {
  babelEnvPresetOptions = {
    modules: false
  };
}

module.exports = {
  "presets": [
    ["@babel/env", babelEnvPresetOptions]
  ],
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread"
  ]
}