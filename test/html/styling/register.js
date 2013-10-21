(function(scope) {

  var extendsRegistry = {};

  function register(name, extnds, proto, templates) {
    extendsRegistry[name] = extnds;
    var typeExtension = extnds && extnds.indexOf('-') < 0;
    var names = calcExtendsNames(name);
    if (window.ShadowDOMPolyfill) {
      shim(templates, names);
    }

    var config = {
      prototype: Object.create(proto, {
        createdCallback: {
          value: function() {
            for (var i=0, n; i < names.length; i++) {
              n = names[i];
              var template = templateForName(n);
              if (template) {
                this.createShadowRoot().appendChild(template.createInstance());
              }
            }
          }
        }
      })
    };
    if (typeExtension) {
      config.extends = extnds;
    }
    var ctor = document.register(name, config);
    return ctor;
  }

  function calcExtendsNames(name) {
    var names = [], n = name;
    while (n) {
      names.push(n);
      n = extendsRegistry[n];
    }
    return names.reverse();
  }

  function templateForName(name) {
    return document.querySelector('#' + name);
  }
  
  function shim(templates, names) {
    var n = names[names.length-1];
    var template = templateForName(n);
    Platform.ShadowCSS.shimStyling(template ? template.content : null, n, extendsRegistry[n]);
  }
  
  scope.register = register;

})(window);

