/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  CustomElements = [
    'CustomElements/src/CustomElements.js',
    'CustomElements/src/HTMLElementElement.js',
    'CustomElements/src/ComponentDocument.js'
  ];
  ShadowDOMShim = [
    'ShadowDOM/src/sdom.js',
    'ShadowDOM/src/ShadowDOMNohd.js',
    'ShadowDOM/src/querySelector.js',
    'ShadowDOM/src/ShadowDOM.js',
    'ShadowDOM/src/inspector.js'
  ];
  Platform = CustomElements.concat(ShadowDOMShim);

  grunt.initConfig({
    uglify: {
      Platform: {
        options: {
          sourceMap: 'platform.min.source-map.js'
        },
        files: {
          'platform.min.js': Platform
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
          themedir: '../docs/doc_themes/simple'
        }
      }
    },
    pkg: grunt.file.readJSON('package.json')
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // tasks
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('minify', ['uglify']);
  grunt.registerTask('docs', ['yuidoc']);
};

