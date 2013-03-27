/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// poor man's adapter for template.content on various platform scenarios
window.templateContent = function(inTemplate) {
  return inTemplate.content;
};

if (!window.WrapperElement) {
  window.wrap = function(n){
    return n;
  }
  window.createShadowRoot = function(inElement) {
    return inElement.webkitCreateShadowRoot();
  };
  window.templateContent = function(inTemplate) {
    // if MDV exists, it may need to boostrap this template to reveal content
    if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
      HTMLTemplateElement.bootstrap(inTemplate);
    }
    // fallback when there is no Shadow DOM polyfill, no MDV polyfill, and no
    // native template support
    if (!inTemplate.content && !inTemplate._content) {
      var frag = document.createDocumentFragment();
      while (inTemplate.firstChild) {
        frag.appendChild(inTemplate.firstChild);
      }
      inTemplate._content = frag;
    }
    return inTemplate.content || inTemplate._content;
  };
} else {
  /*
  // patch addEventListener
  document.addEventListener = function() {
    var wd = wrap(document);
    wd.addEventListener.apply(wd, arguments);
  };
  // patch body.appendChild
  window.addEventListener('load', function() {
    document.body.appendChild = function() {
      var wb = wrap(document.body);
      wb.appendChild.apply(wb, arguments);
    };
  });
  */
  // patch in custom querySelector
  var queryPropDefs = {
    querySelector: {
      value: function(inSlctr) {
        return localQuery(this, inSlctr);
      }
    },
    querySelectorAll: {
      value: function(inSlctr) {
        return localQueryAll(this, inSlctr);
      }
    }
  };
  // install custom querySelector(All) on WrapperElement
  Object.defineProperties(WrapperElement.prototype, queryPropDefs);
  // install custom querySelector(All) on WrapperDocument
  Object.defineProperties(WrapperDocument.prototype, queryPropDefs);
  // install custom querySelector(All) on WrapperShadowRoot
  Object.defineProperties(WrapperShadowRoot.prototype, queryPropDefs);
  // install custom querySelector(All) on WrapperDocumentFragment
  //Object.defineProperties(WrapperDocumentFragment.prototype, queryPropDefs);

  // patch in prefixed names
  Object.defineProperties(WrapperElement.prototype, {
    //TODO(sjmiles): review accessor alias with Arv
    webkitShadowRoot: {
      get: function() {
        return this.shadowRoot;
      }
    }
  });
  //TODO(sjmiles): review method alias with Arv
  WrapperElement.prototype.webkitCreateShadowRoot =
      WrapperElement.prototype.createShadowRoot;
}
