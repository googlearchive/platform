/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  var temporary = require('temporary');
  var tmp = new temporary.File();

  // recursive module builder
  var path = require('path');
  function readManifest(filename, modules) {
    modules = modules || [];
    var lines = grunt.file.readJSON(filename);
    var dir = path.dirname(filename);
    lines.forEach(function(line) {
      var fullpath = path.join(dir, line);
      if (line.slice(-5) == '.json') {
        // recurse
        readManifest(fullpath, modules);
      } else {
        modules.push(fullpath);
      }
    });
    return modules;
  }

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
          'platform.concat.js': readManifest('build.json', [tmp.path])
        }
      }
    },
    uglify: {
      options: {
        banner: grunt.file.read('LICENSE'),
        nonull: true,
        compress: {
          unsafe: false
        }
      },
      Platform: {
        options: {
          sourceMap: 'platform.min.js.map',
          sourceMapIn: 'platform.concat.js.map'
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

  // tasks
  grunt.registerTask('sourcemap_copy', 'Copy sourcesContent between sourcemaps', function(source, dest) {
    var sourceMap = grunt.file.readJSON(source);
    var destMap = grunt.file.readJSON(dest);
    destMap.sourcesContent = [];
    var ssources = sourceMap.sources;
    // uglify may reorder sources, make sure sourcesContent matches new order
    destMap.sources.forEach(function(source) {
      var j = ssources.indexOf(source);
      destMap.sourcesContent.push(sourceMap.sourcesContent[j]);
    });
    grunt.file.write(dest, JSON.stringify(destMap));
  });

  // Workaround for banner + sourceMap + uglify: https://github.com/gruntjs/grunt-contrib-uglify/issues/22
  grunt.registerTask('gen_license', function() {
    var banner = [
      '/* @license',
      grunt.file.read('LICENSE'),
      '*/'
    ].join(grunt.util.linefeed);
    grunt.file.write(tmp.path, banner);
  });

  grunt.registerTask('clean_license', function() {
    tmp.unlinkSync();
  });

  grunt.registerTask('default', ['gen_license', 'concat_sourcemap', 'uglify', 'sourcemap_copy:platform.concat.js.map:platform.min.js.map', 'clean_license']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('test', ['override-chrome-launcher', 'karma:platform']);
  grunt.registerTask('test-buildbot', ['override-chrome-launcher', 'karma:buildbot']);
};

