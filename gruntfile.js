/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
module.exports = function(grunt) {
	CustomElements = [
		'CustomElements/src/CustomElements.js',
		'CustomElements/src/HTMLElementElement.js',
		'CustomElements/src/ComponentDocument.js'
	];
  ShadowDOM = [
		'ShadowDOM/src/sdom.js',
		'ShadowDOM/src/ShadowDOMNohd.js',
		'ShadowDOM/src/querySelector.js',
		'ShadowDOM/src/ShadowDOM.js',
		'ShadowDOM/src/inspector.js'
	];
	Platform = CustomElements.concat(ShadowDOM);

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
		}
  });

  // plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // tasks
  grunt.registerTask('default', ['uglify']);
};

