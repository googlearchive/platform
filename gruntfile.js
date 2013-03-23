/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
  WebComponents = [
    'WebComponents/src/WebComponents.js'
  ];
  
  CustomElements = [
    'CustomElements/src/CustomElements.js',
    'CustomElements/src/HTMLElementElement.js',
    'CustomElements/src/Parser.js'
  ];
  
  ShadowDOM = [
    'sidetable.js',
    'wrappers.js',
    'wrappers/node-interfaces.js',
    'wrappers/EventTarget.js',
    'wrappers/MouseEvent.js',
    'wrappers/Node.js',
    'wrappers/CharacterData.js',
    'wrappers/NodeList.js',
    'wrappers/Element.js',
    'wrappers/HTMLElement.js',
    'wrappers/HTMLUnknownElement.js',
    'wrappers/HTMLContentElement.js',
    'wrappers/HTMLShadowElement.js',
    'wrappers/HTMLTemplateElement.js',
    'wrappers/generic.js',
    'wrappers/ShadowRoot.js',
    'ShadowRenderer.js',
    'wrappers/Document.js'
  ];
  ShadowDOM = ShadowDOM.map(function(p) {
    return 'ShadowDOM/src/' + p;
  });
  
  Lib = [
    'lib/querySelector.js',
    'lib/inspector.js',
    'lib/patches.js'
  ];
  
  Platform = [].concat(
    WebComponents, 
    CustomElements,
    Lib
  );
    
  PlatformPoly = [].concat(
    ShadowDOM,
    WebComponents, 
    CustomElements,
    Lib
  );

  grunt.initConfig({
    uglify: {
      Platform: {
        /*
        options: {
          sourceMap: 'platform.min.source-map.js'
        },
        */
        files: {
          'platform.min.js': Platform
        }
      },
      PlatformPoly: {
        options: {
          compress: false,
          mangle: false,
          beautify: true,
          Xreport: 'gzip'
        },
        files: {
          'platform.poly.min.js': PlatformPoly
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

