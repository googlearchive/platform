/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function(scope) {

// Old versions of iOS do not have bind.

if (!Function.prototype.bind) {
  Function.prototype.bind = function(scope) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
      var args2 = args.slice();
      args2.push.apply(args2, arguments);
      return self.apply(scope, args2);
    };
  };
}

// namespace an import from CustomElements
// TODO(sjmiles): clean up this global
scope.mixin = window.mixin;

})(window.Platform);