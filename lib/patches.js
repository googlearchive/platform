/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

window.templateContent = window.templateContent || function(inTemplate) {
  return inTemplate.content;
};

if (!window.ShadowDOMPolyfill) {
  window.wrap = function(n){
    return n;
  }
  window.createShadowRoot = function(inElement) {
    return inElement.webkitCreateShadowRoot();
  };
  window.templateContent = function(inTemplate) {
    // allow MDV to bootstrap templates if it's around
    if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
      HTMLTemplateElement.bootstrap(inTemplate);
    }
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
  // MDV wants to customize prototypes on HTMLTemplateElement and Text
  HTMLTemplateElement = ShadowDOMPolyfill.WrapperHTMLElement;
  (function() {
    var n = document.createTextNode();
    Text = function(){};
    Text.prototype = Object.getPrototypeOf(n);
  })();
  
  // users may want to customize other types
  (function() {
    var elts = {HTMLButtonElement: 'button'};
    for (var c in elts) {
      window[c] = function() { throw 'Patched Constructor'; };
      window[c].prototype = Object.getPrototypeOf(
          document.createElement(elts[c]));
    }
  })();
  
  // ensure CustomEvent produces wrapped events
  if (window.CustomEvent) {
    var nativeCustomEvent = CustomEvent;
    window.CustomEvent = function(inType, inOptions) {
      return ShadowDOMPolyfill.wrap(new nativeCustomEvent(inType, inOptions));
    };
  }
  
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
  Object.defineProperties(HTMLElement.prototype, queryPropDefs);
  // install custom querySelector(All) on WrapperDocument
  Object.defineProperties(ShadowDOMPolyfill.WrapperDocument.prototype, 
    queryPropDefs);
  // install custom querySelector(All) on WrapperShadowRoot
  Object.defineProperties(ShadowDOMPolyfill.WrapperShadowRoot.prototype, 
      queryPropDefs);
  // install custom querySelector(All) on WrapperDocumentFragment
  //Object.defineProperties(WrapperDocumentFragment.prototype, queryPropDefs);

  // patch in prefixed names 
  Object.defineProperties(HTMLElement.prototype, {
    //TODO(sjmiles): review accessor alias with Arv
    webkitShadowRoot: {
      get: function() {
        return this.shadowRoot;
      }
    }
  });
  
  //TODO(sjmiles): review method alias with Arv
  HTMLElement.prototype.webkitCreateShadowRoot =
      HTMLElement.prototype.createShadowRoot;
}
