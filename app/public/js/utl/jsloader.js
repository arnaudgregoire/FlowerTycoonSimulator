"use strict";

class JsLoader {
  constructor() {
    this.file_number = 0;
    this.callback = undefined;
  }

  load(files, callback) {
    let file_list = Array.isArray(files) ? files : [files];

    this.onLoad(callback);

    if(document.readyState === "complete") {
      for (var file of file_list) {
        this._load( String(file) );
      }
    }
    else {
       window.addEventListener("load", () => {
        this.load(file_list);
       }, false);
    }
  }

  onLoad(callback) {
    if (typeof(callback) == "function") {
      this.callback = callback;
    }
  }

  isReady() {
    return this.file_number <= 0;
  }


  _load(file){
    this.file_number++;

    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = String(file);

    script.onload = () => {
      // console.log("Loaded:", script.src);
      this.file_number--;

      if(this.isReady()){
        this.callback();
      }
    };

    head.appendChild(script);
  }
}
window.JsLoader = JsLoader;
