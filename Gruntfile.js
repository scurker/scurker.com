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
          'css/style.css': 'css/*.css'
        }
      }
    },

    autoprefixer: {
      files: {
        'css/style.css': 'css/*.css'
      }
    },

    sass: {
      compile: {
        files: {
          'css/style.css': 'css/style.scss'
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