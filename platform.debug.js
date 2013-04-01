/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

// imports

var flags = __platform__.flags;
var base = __platform__.base;

// module dependencies

var ShadowDOM = [
  'ShadowDOM/shadowdom.js',
  'lib/querySelector.js'
];

var Patches = [
  'lib/lang.js',
  'lib/dom_token_list.js',
  'lib/patches.js',
  'lib/inspector.js'
];

var MDV = [
  'MDV/src/mdv.js',   
  'lib/dirty-check.js'
];

var WebElements = [
  'WebComponents/web-components.js',
  'CustomElements/custom-elements.js'
];

var Pointer = [
  'PointerGestures/src/pointergestures.js'
];

// construct active dependency list

modules = [];
if (flags.shadow === 'polyfill') {
  modules = modules.concat(ShadowDOM);
}
modules = modules.concat(
  Patches, 
  MDV, 
  WebElements, 
  Pointer
);

// write script tags for dependencies

modules.forEach(function(inSrc) {
  document.write('<script src="' + base + inSrc + '"></script>');
});

})(window.__exported_components_polyfill_scope__);
