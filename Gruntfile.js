/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'src/*.js', 'test/*.js']
    },

    watch: {
      dev: {
        files: ['<%= jshint.all %>'],
        tasks: ['default']
      }
    },

    mochaTest: {
      test: {
        options: {
          //reporter: 'progress'
        },
        src: ['test/**/*_test.js']
      }
    },

    readme: {
      options: {
        boilerplate: 'node-util'
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-readme');

  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('dev', ['default', 'watch']);

};
