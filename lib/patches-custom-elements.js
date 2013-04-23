/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function() {

// inject style sheet
document.write('<style>element {display: none;} /* injected by platform.js */</style>');

if (window.ShadowDOMPolyfill) {

  function nop() {};

  // disable shadow dom watching
  CustomElements.watchShadow = nop;
  CustomElements.watchAllShadows = nop;

  // ensure wrapped inputs for these functions
  var fns = ['upgradeAll', 'upgradeSubtree', 'observeDocument',
      'upgradeDocument'];

  // cache originals
  var original = {};
  fns.forEach(function(fn) {
    original[fn] = CustomElements[fn];
  });

  // override
  fns.forEach(function(fn) {
    CustomElements[fn] = function(inNode) {
      return original[fn](wrap(inNode));
    };
  });

}

})();
