import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

const dest = 'build';

export default {
  input: 'site/js/global.js',
  plugins: [
    babel(),
    uglify()
  ],
  output: {
    file: `${dest}/assets/global.js`,
    format: 'iife'
  }
};