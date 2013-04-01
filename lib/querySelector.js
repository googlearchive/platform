/*
Copyright 2013 The Toolkitchen Authors. All rights reserved.
Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file.
*/

// custom selectors:
//
// #<id>    = node with id === <id>
// *        = any non-Text node
// .<class> = any node with <class> in it's classList
// [<attr>] = any node with attribute <attr>
// name     = any node with name === localName
// name1, name2, name3, ... = any node whose localName matches one of these
//
var generateMatcher = function(inSlctr) {
  if (!inSlctr) {
    return;
  }
  var c = inSlctr[0], m;
  if (c === '#') {
    m = inSlctr.slice(1);
    return function(inNode) {
      return inNode.id === m;
    };
  }
  if (inSlctr === '*') {
    return function(inNode) {
      return inNode.nodeName !== '#text';
    };
  }
  if (c === '.') {
    m = inSlctr.slice(1);
    return function(inNode) {
      return inNode.classList && inNode.classList.contains(m);
    };
  }
  if (c === '[') {
    m = inSlctr.slice(1, -1);
    m = m.split('=');
    var v = m[1];
    m = m[0];
    if (v) {
      return function(inNode) {
        return inNode.getAttribute && inNode.getAttribute(m) == v;
      };
    } else {
      return function(inNode) {
        return inNode.hasAttribute && inNode.hasAttribute(m);
      };
    }
  }
  var slctrs = inSlctr.toLowerCase().split(',');
  return function(inNode) {
    return (slctrs.indexOf(inNode.localName) >= 0);
  };
};

// utility

var isInsertionPoint = function(inNode) {
  return {SHADOW:1, CONTENT:1}[inNode.tagName];
};

var search = function(inNodes, inMatcher) {
  var results = [];
  for (var i=0, n; (n=inNodes[i]); i++) {
    if (inMatcher(n)) {
      results.push(n);
    }
    if (!isInsertionPoint(n)) {
      results = results.concat(_search(n, inMatcher));
    }
  }
  return results;
};

var _search = function(inNode, inMatcher) {
  return search(inNode.childNodes, inMatcher);
};

var localQueryAll = function(inNode, inSlctr) {
  return search(inNode.childNodes, generateMatcher(inSlctr));
};

var localQuery = function(inNode, inSlctr) {
  return localQueryAll(inNode, inSlctr)[0];
};