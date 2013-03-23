/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

var thisFile = 'platform.js';

// NOTE: use attributes on the script tag for this file as directives

// exportAs="[name]"		exports polyfill scope into window as 'name'
// shadow="shim"        use shim version of ShadowDOM (otherwise native)

// NOTE: uses 'window' and 'document' globals

// acquire directives and base path from script element

var source, base = '';

(function() {
  var s$ = document.querySelectorAll('script[src]');
  Array.prototype.forEach.call(s$, function(s) {
    var src = s.getAttribute('src');
    if (src.slice(-thisFile.length) === thisFile) {
      source = s;
      base = src.slice(0, -thisFile.length);
    }
  });
  source = source || {
    getAttribute: nop
  };
})();

// flags

var flags = {};

// shadow defaults

flags.shadow = HTMLElement.prototype.webkitCreateShadowRoot ? 'native'
    : 'polyfill';

// acquire flags from script tag attributes

for (var i=0, a; (a=source.attributes[i]); i++) {
  flags[a.name] = a.value || true;
}

// acquire flags from url

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

scope = scope || {};

if (flags.exportas) {
  window[flags.exportas] = scope;
}
window.__exported_components_polyfill_scope__ = scope;

// module exports

scope.flags = flags;

// report effective flags

console.log(flags);

// module dependencies

var MDV = [
  'MDV/src/mdv.js',   
  'lib/dirty-check.js'
];

var ShadowDOM = [
  'ShadowDOM/shadowdom.js',
  'lib/querySelector.js',
  'lib/inspector.js',
];

var platform = [
  'WebComponents/web-components.js',
  'CustomElements/custom-elements.js',
  //'PointerGestures/src/pointergestures.js',
  'lib/lang.js',
  'lib/dom_token_list.js'
];

// active dependency list

modules = [];

// TODO(sjmiles): load MDV before ShadowDOM: MDV modifies Node prototypes which 
// must happen before ShadowDOM polyfill loads
if (flags.shadow !== 'polyfill') {
  modules = modules.concat(MDV);
}

if (flags.shadow === 'polyfill') {
  modules = modules.concat(ShadowDOM);
}

modules = modules.concat(platform);


// integration patches

modules.push(
  'lib/patches.js'
);

// write script tags for dependencies

modules.forEach(function(inSrc) {
  document.write('<script src="' + base + inSrc + '"></script>');
});

})(window.__exported_components_polyfill_scope__);
