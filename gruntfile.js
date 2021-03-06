module.exports = function(grunt) {
  grunt.initConfig ({

    // Make package info available to tasks
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      source: {
        files: ['sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true, // needed to run LiveReload
        }
      }
    },

    nodemon: {
      dev: {
        script: './bin/www',
        options: {
          ignore: ['node_modules/**', 'public', 'src/browser']
        }
      }
    },

    sass: {
      dist: {
        files: {
          'public/stylesheets/style.css' : 'sass/style.scss'
        }
      }
    },

        concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('default', ['sass', 'concurrent:dev']);
};

