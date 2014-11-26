module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/*!\n' +
      ' * <%= pkg.name %> - v<%= pkg.version %>\n' +
      ' * <%= pkg.description %>\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n'+
      ' * <%= pkg.license %> license\n'+
      ' */',

    config: {
      build: 'build/',
      css: 'css/'
    },

    watch: {
      sass: {
        files: ['<%= config.css %>*.{scss,sass}'],
        tasks: ['sass:compile', 'autoprefixer']
      },
      options: {
        livereload: true
      }
    },

    cssmin: {
      options: {
        banner: '<%= banner %>',
        keepSpecialComments: 0
      },
      minify: {
        files: {
          '<%= config.css %>global.css': '<%= config.css %>*.css'
        }
      }
    },

    autoprefixer: {
      files: {
        '<%= config.css %>global.css': '<%= config.css %>*.css'
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.build %>',
          dest: '<%= config.build %>',
          src: ['**/*.html'],
          ext: '.html'
        }]
      }
    },

    sass: {
      compile: {
        files: {
          '<%= config.css %>global.css': '<%= config.css %>global.scss'
        }
      },
      options: {
        style: 'compact',
        sourcemap: true
      }
    }

  });

  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['sass', 'autoprefixer', 'cssmin']);
  grunt.registerTask('build', ['sass', 'autoprefixer', 'cssmin', 'htmlmin']);

};