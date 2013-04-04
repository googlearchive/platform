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

var ShadowDOMNative = [
  'lib/patches-shadowdom-native.js'
];

var ShadowDOMPolyfill = [
  'ShadowDOM/shadowdom.js',
  'lib/patches-shadowdom-polyfill.js',
  'lib/querySelector.js'
];

var Lib = [
  'lib/lang.js',
  'lib/dom.js',
  'lib/template.js',
  'lib/inspector.js',
];

var MDV = [
  'MDV/src/mdv.js',
  'lib/patches-mdv.js'
];

var Pointer = [
  'PointerGestures/src/pointergestures.js'
];

var WebElements = [
  'HTMLImports/html-imports.js',
  'CustomElements/custom-elements.js'
];

// select ShadowDOM impl

var ShadowDOM = (flags.shadow === 'polyfill') ? ShadowDOMPolyfill
    : ShadowDOMNative;

// construct active dependency list

modules = [].concat(
  Lib,
  ShadowDOM,
  MDV,
  WebElements,
  Pointer
);

// write script tags for dependencies

modules.forEach(function(inSrc) {
  document.write('<script src="' + base + inSrc + '"></script>');
});

})(window.__exported_components_polyfill_scope__);
