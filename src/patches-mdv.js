/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
(function(scope) {

// inject style sheet
var style = document.createElement('style');
style.textContent = 'template {display: none !important;} /* injected by platform.js */';
var head = document.querySelector('head');
head.insertBefore(style, head.firstChild);

// dirtyCheck (with logging)
function dirtyCheck() {
  logFlags.data && console.group("Platform.performMicrotaskCheckpoint()");
  check();
  logFlags.data && console.groupEnd();
};

// call notifyChanges in Model scope
function check() {
  scope.endOfMicrotask(Platform.performMicrotaskCheckpoint);
};

var dirtyCheckPollInterval = 125;

// polling dirty checker
window.addEventListener('WebComponentsReady', function() {
  // timeout keeps the profile clean
  //setTimeout(function() {
    //console.profile('initial model dirty check');
    dirtyCheck();
    //console.profileEnd();
  //}, 0);
  
  // dirty check periodically if platform does not have object observe.
  if (!Observer.hasObjectObserve) {
    scope.dirtyPoll = setInterval(check, dirtyCheckPollInterval);
  }
});

// exports
scope.flush = dirtyCheck;

// deprecated

window.dirtyCheck = dirtyCheck;

})(window.Platform);

