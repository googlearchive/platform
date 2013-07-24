/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

// imports

var flags = scope.flags;
var base = scope.basePath;

// truthy value for any of these flags or failure to detect native
// shadowDOM results in polyfill
flags.shadow = (flags.shadowdom || flags.shadow || flags.polyfill ||
    !HTMLElement.prototype.webkitCreateShadowRoot) && 'polyfill';

// module dependencies

var ShadowDOMNative = [
  'src/patches-shadowdom-native.js'
];

var ShadowDOMPolyfill = [
  '../ShadowDOM/shadowdom.js',
  'src/patches-shadowdom-polyfill.js'
];

var Lib = [
  'src/lang.js',
  'src/dom.js',
  'src/template.js',
  'src/inspector.js',
];

var MDV = [
  '../mdv/mdv.js',
  'src/patches-mdv.js'
];

var Pointer = [
  '../PointerGestures/pointergestures.js'
];

var WebElements = [
  '../HTMLImports/html-imports.js',
  '../CustomElements/custom-elements.js',
  'src/patches-custom-elements.js'
];

// select ShadowDOM impl

var ShadowDOM = flags.shadow ? ShadowDOMPolyfill : ShadowDOMNative;

// construct active dependency list

modules = [].concat(
  ShadowDOM,
  Lib,
  WebElements,
  Pointer,
  MDV
);

// write script tags for dependencies

modules.forEach(function(inSrc) {
  document.write('<script src="' + base + inSrc + '"></script>');
});

})(Platform);
