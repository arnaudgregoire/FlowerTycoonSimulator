"use strict";
class AssetLoader {
  constructor() {
    this.cache = {};
    this.callbackList = [];
  }

  load(array) {
    if(array instanceof Array) {
      array.forEach(function(e) { this._load(e); }.bind(this));
    }
    else {
      this._load(array);
    }
  }

  get(key) {
    return this.cache[key];
  }

  isReady() {
    for(var k in this.cache) {
      if(this.cache.hasOwnProperty(k) && !this.cache[k]) {
        return false;
      }
    }
    return true;
  }

  onLoad(func) {
    if(typeof(func) == "function"){
      this.callbackList.push(func);
    }
  };

  _load(asset) {
    let key = "", src = "";
    if(asset instanceof Array) {
      key = asset[0];
      src = asset[1];
    }
    else{
      key = src = String(asset);
    }

    if(this.cache[key]) {
      return this.cache[key];
    }
    else{
      let img = new Image();

      img.onload = function () {
        this.cache[key] = img;
        if(this.isReady()) {
          this.callbackList.forEach(function (func) { func(); });
        }
      }.bind(this);
      this.cache[key] = false;
      img.src = src;
    }
  }

}
window.AssetLoader = AssetLoader;
