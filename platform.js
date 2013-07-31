/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

var thisFile = 'platform.js';
var scopeName = 'Platform';

function processFlags(flags) {
  if (flags.build) {
    // use the minified build
    this.modules = ['platform.min.js'];
  } else {
    // truthy value for any of these flags or failure to detect native
    // shadowDOM results in polyfill
    flags.shadow = (flags.shadowdom || flags.shadow || flags.polyfill ||
                    !HTMLElement.prototype.webkitCreateShadowRoot) && 'polyfill';

    var ShadowDOMNative = [
      'src/patches-shadowdom-native.js'
    ];

    var ShadowDOMPolyfill = [
      '../ShadowDOM/shadowdom.js',
      'src/patches-shadowdom-polyfill.js',
      'src/ShadowCSS.js'
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
    this.modules = [].concat(
      ShadowDOM,
      Lib,
      WebElements,
      Pointer,
      MDV
    );
  }
}

// export

window[scopeName] = {
  entryPointName: thisFile,
  processFlags: processFlags
};

// bootstrap

var script = document.querySelector('script[src*="' + thisFile + '"]');
var src = script.attributes.src.value;
var basePath = src.slice(0, src.indexOf(thisFile));

if (!window.Loader) {
  var path = basePath + 'tools/loader/loader.js';
  document.write('<script src="' + path + '"></script>');
}
document.write('<script>Loader.load("' + scopeName + '")</script>');

})();
