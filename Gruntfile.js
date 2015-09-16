module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //合并
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['page/**/*.js'],
        dest: 'page/dist/<%= pkg.name %>.js'
      }
    },
    //压缩
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'page/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    
  });

    // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [ 'concat', 'uglify']);

};