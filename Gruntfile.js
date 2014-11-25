module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      sass: {
        files: ['css/*.{scss,sass}'],
        tasks: ['sass:compile', 'autoprefixer']
      },
      options: {
        livereload: true
      }
    },

    cssmin: {
      minify: {
        files: {
          'css/global.css': 'css/*.css'
        }
      }
    },

    autoprefixer: {
      files: {
        'css/global.css': 'css/*.css'
      }
    },

    sass: {
      compile: {
        files: {
          'css/global.css': 'css/global.scss'
        }
      },
      options: {
        style: 'compact',
        sourcemap: true
      }
    }

  });

  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['sass', 'autoprefixer']);

};