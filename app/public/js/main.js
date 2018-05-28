"use strict";

const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/
// C:Users\msawada\Desktop\flowerTycoonSimulator\app
const JS_FILES = {
  "shared/": {
    ".": "utils",
    "game/": ["flower", "tile", "farm", "player"]
  },
  "public/js/": ["img-loader", "socket-manager", "ui-manager", "game"]
};


window.onload = function () {
  JsLoader.load(JS_FILES).then(function () {
    (new Game({
      url: URL,
      canvasID: "canvas",
      columns: 10,
      rows: 10
    })).init();
  });
}
