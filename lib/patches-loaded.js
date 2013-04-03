/*
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

// MDV hook for processing created dom before bindings are made. We upgrade
// so custom elements get a chance to deal with bindings mdv is about to make.
HTMLTemplateElement.__instanceCreated = function(inNode) {
  document.upgradeElements(inNode);
}
