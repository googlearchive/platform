/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  var readManifest = require('../tools/loader/readManifest.js');

  grunt.initConfig({
    karma: {
      options: {
        configFile: 'conf/karma.conf.js',
        keepalive: true,
      },
      buildbot: {
        reporters: ['crbot'],
        logLevel: 'OFF'
      },
      platform: {
      }
    },
    concat_sourcemap: {
      Platform: {
        options: {
          sourcesContent: true,
          nonull: true
        },
        files: {
          'platform.concat.js': readManifest('build.json')
        }
      }
    },
    concat: {
      lite: {
        files: {
          'platform-lite.concat.js': readManifest('build-lite.json')
        }
      }
    },
    uglify: {
      options: {
        nonull: true,
        compress: {
          unsafe: false
        }
      },
      Platform: {
        options: {
          sourceMap: 'platform.min.js.map',
          sourceMapIn: 'platform.concat.js.map',
          banner: grunt.file.read('LICENSE')
        },
        files: {
          'platform.min.js': 'platform.concat.js'
        }
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          exclude: 'third_party',
          paths: '.',
          outdir: 'docs',
          linkNatives: 'true',
          tabtospace: 2,
          themedir: '../tools/doc/themes/bootstrap'
        }
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadTasks('../tools/tasks');
  // plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-concat-sourcemap');

  grunt.registerTask('stash', 'prepare for testing build', function() {
    grunt.option('force', true);
    grunt.task.run('move:platform.js:platform.js.bak');
    grunt.task.run('move:platform.min.js:platform.js');
  });
  grunt.registerTask('restore', function() {
    grunt.task.run('move:platform.js:platform.min.js');
    grunt.task.run('move:platform.js.bak:platform.js');
    grunt.option('force', false);
  });

  grunt.registerTask('test-build', ['default', 'stash', 'test', 'restore']);

  grunt.registerTask('default', ['concat_sourcemap', 'uglify', 'sourcemap_copy:platform.concat.js.map:platform.min.js.map']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('test', ['override-chrome-launcher', 'karma:platform']);
  grunt.registerTask('test-buildbot', ['override-chrome-launcher', 'karma:buildbot', 'test-build']);
  grunt.registerTask('build-lite', ['concat']);
};

