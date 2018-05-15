var JsLoader = window.JsLoader = (function (window, document) {
  "use strict";

  var file_number = 0;
  var callback_list = [];

  function isReady () {
    return file_number === 0;
  }

  function onLoad(func) {
    if(typeof(func) == "function"){
      callback_list.push(func);
    }
  }

  function _exec (e) {
    if (typeof(e) == "function") {
      e();
    }
    else if (Array.isArray(e)) {
      for (var i = 0; i < e.length; i++) {
        _exec(e[i]);
      }
    }
  }

  function _load (src) {
    file_number++;

    let s = src.split(".");
    if(s[s.length-1] != "js") { src += ".js"}

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = String(src);
    script.onload = function () {
      file_number--;
      if (isReady()) {
        _exec(callback_list);
      }
    }

    document.head.appendChild(script);
  }

  function _load_tree(root, node) {
    let url = (root == null ? "" : String(root));

    if (typeof node == "string") {
      _load(url + node);
    }
    else if(Array.isArray(node)) {
      for (var file of node) {
        _load_tree(url, file);
      }
    }
    else {
      let keys = Object.keys(node);
      for (var k of keys) {
        if(k === ".") {
          _load_tree(url, node[k]);
        }
        else {
          _load_tree(url+k, node[k]);
        }
      }
    }
  }

  function load (array, func) {
    let file_list = Array.isArray(array) ? array : [array];
    onLoad(func);

    if(document.readyState === "complete") {
      for (var src of file_list) {
        _load( String(src) );
      }
    }
    else {
       window.addEventListener("load", function () {
        load(file_list);
      }, false);
    }
  }

  function loadTree(tree, func) {
    onLoad(func);

    if(document.readyState === "complete") {
      _load_tree(null, tree);
    }
    else {
       window.addEventListener("load", function () {
        _load_tree(null, tree);
      }, false);
    }
  }

  return  {
    load: load,
    loadTree: loadTree,
    isReady: isReady,
    onLoad: onLoad
  };

})(window, window.document);
