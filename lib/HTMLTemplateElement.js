// Copyright 2013 The Toolkitchen Authors. All rights reserved.
// Use of this source code is goverened by a BSD-style
// license that can be found in the LICENSE file.

(function(exports) {
  'use strict';

  function WrapperHTMLTemplateElement(node) {
    WrapperHTMLElement.call(this, node);
  }
  WrapperHTMLTemplateElement.prototype = Object.create(WrapperHTMLElement.prototype);
  mixin(WrapperHTMLTemplateElement.prototype, {
    get content() {
      return wrap(this.node.content);
    }
  });

  if (typeof HTMLTemplateElement !== 'undefined')
    wrappers.register(HTMLTemplateElement, WrapperHTMLTemplateElement);

  exports.WrapperHTMLTemplateElement = WrapperHTMLTemplateElement;
})(this);