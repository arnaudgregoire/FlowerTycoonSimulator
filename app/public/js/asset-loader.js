var AssetLoader = window.AssetLoader = (function () {
  "use strict";

  var cache = {};
  var callback_list = [];

  function isReady() {
    for(var k in cache) {
      if(cache.hasOwnProperty(k) && !cache[k]) {
        return false;
      }
    }
    return true;
  }

  function onLoad(func) {
    if(typeof(func) == "function"){
      callback_list.push(func);
    }
  }

  function get(key) {
    return cache[key];
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

  function _load(asset) {
    let key = "", src = "";
    if(Array.isArray(asset)) {
      key = asset[0];
      src = asset[1];
    }
    else{
      key = src = String(asset);
    }

    if(cache[key]) {
      return cache[key];
    }
    else{
      let img = new Image();

      img.onload = function () {
        cache[key] = img;
        if(isReady()) {
          _exec(callback_list);
        }
      }
      cache[key] = false;
      img.src = src;
    }
  }

  function load(array, func) {
    onLoad(func);
    let asset_list = Array.isArray(array) ? array : [array];
    for (var i = 0; i < asset_list.length; i++) {
      _load(asset_list[i]);
    }
  }

  
  return {
    load: load,
    isReady: isReady,
    onLoad: onLoad,
    get: get
  };

})();
