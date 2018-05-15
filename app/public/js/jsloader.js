var JsLoader = window.JsLoader = (function (window, document) {
  "use strict";

  var file_number = 0;
  var callback = undefined;

  function isReady () {
    return file_number === 0;
  }

  function onLoad(func) {
    callback = func;
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
    else {
      //
    }
  }

  function _load (src) {
    file_number++;

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = String(src);

    script.onload = function () {
      file_number--;
      if (isReady()) {
        _exec(callback);
      }
    }

    console.log(script);
    document.head.appendChild(script);
  }

  function load (array, func) {
    let src_list = Array.isArray(array) ? array : [array];
    callback = func;

    if(document.readyState === "complete") {
      for (var src of src_list) {
        _load( String(src) );
      }
    }
    else {
       window.addEventListener("load", function () {
        load(file_list);
      }, false);
    }
  }

  return  {
    load: load,
    isReady: isReady,
    onLoad: onLoad
  };

})(window, window.document);
