/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

// NOTE: uses 'window' and 'document' globals

var thisFile = 'platform.js';

// NOTE: use attributes on the script tag for this file as directives

// exportAs="[name]"            exports polyfill scope into window as 'name'
// shadow="polyfill|native"     use polyfill version of ShadowDOM (default native)
// log="data,bind,event,[...]"  enable logging categories

// acquire directives and base path from script element

var source, base = '', attrs = [];

(function() {
  var s$ = document.querySelectorAll('script[src]');
  Array.prototype.forEach.call(s$, function(s) {
    var src = s.getAttribute('src');
    if (src.slice(-thisFile.length) === thisFile) {
      attrs = s.attributes;
      base = src.slice(0, -thisFile.length);
    }
  });
})();

// default flags

var flags = {
  shadow: HTMLElement.prototype.webkitCreateShadowRoot ? 'native' : 'polyfill'
};

// acquire override flags from script tag attributes

for (var i=0, a; (a=attrs[i]); i++) {
  flags[a.name] = a.value || true;
}

// acquire override flags from url

if (!flags.noOpts) {
  location.search.slice(1).split('&').forEach(function(o) {
    o = o.split('=');
    flags[o[0]] = o[1] || true;
  });
}

// process log flags

var logFlags = {};
if (flags.log) {
  flags.log.split(',').forEach(function(f) {
    logFlags[f] = true;
  });
}
window.logFlags = logFlags;

// support exportas directive

scope = scope || window;

if (flags.exportas) {
  window[flags.exportas] = scope;
}
window.__exported_components_polyfill_scope__ = scope;

// module exports

scope.flags = flags;

if (flags.debug) {
  // TODO(sjmiles): ham-handed communication with debug loader
  window.__platform__ = {
    flags: flags,
    base: base
  };
}

// report effective flags

console.log(flags);

// module dependencies

var modules = flags.debug ? ['platform.debug.js'] :
    flags.shadow ==='polyfill' ? ['platform.poly.min.js'] :
      ['platform.min.js'];

// write script tags for dependencies

modules.forEach(function(inSrc) {
  document.write('<script src="' + base + inSrc + '"></script>');
});

// css dependencies

// TODO(sjmiles): ad-hoc, no build support for CSS as yet
var sheets = flags.debug ? [] : ['MDV/src/template_element.css'];

// write link tags for styles

sheets.forEach(function(inSrc) {
  document.write('<link rel="stylesheet" href="' + base + inSrc + '">');
});
})(window.__exported_components_polyfill_scope__);
