"use strict";

const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/
// C:Users\msawada\Desktop\flowertycoonsimulator\app
const JS_FILES = {
  "shared/": {
    ".": "utils",
    "game/": ["plantSpecies", "plant", "tile", "farm", "player", "seed", "bouquet"]
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
