var ImgLoader = window.ImgLoader = (function () {
  'use strict';

  var cache = {};
  var callback = null;
  var folder = "";

  function isReady() {
    for(var k in cache) {
      if(cache.hasOwnProperty(k) && !cache[k]) {
        return false;
      }
    }
    return true;
  }

  function get(key) {
    return cache[key];
  }

  function onLoad(func) {
    if(typeof(func) == "function"){
      callback = func;
    }
  }

  function load(array, func) {
    onLoad(func);

    let asset_list = Array.isArray(array) ? array : [array];
    for (var asset of asset_list) {
      _load(asset);
    }
  }

  function setMainDirectory(dir) {
    if(typeof dir === "string") {
      folder = dir;
    }
  }

  function _load(asset) {
    let src = "", key = "";
    if (typeof asset === "string") {
      src = folder + asset;
      key = asset;
    }
    else if (typeof asset === "object") {
      key = Object.keys(asset)[0];
      src = folder + asset[key];
    }

    if(cache[key]) {
      return cache[key];
    }
    else{
      let img = new Image();

      img.onload = function () {
        cache[key] = img;
        if(isReady() && typeof(callback) === "function") {
          callback();
        }
      }
      cache[key] = false;
      img.src = src;
    }
  }

  return {
    load: load,
    isReady: isReady,
    onLoad: onLoad,
    get: get,
    setMainDirectory: setMainDirectory
  };

})();
