"use strict";

// const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/
const URL = "file:///C:/Users/Augustin/Desktop/FlowerTycoonSimulator/app/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/

const JS_DEPENDENCIES = {
  [URL]: {
    "shared/": {
      ".": "utils",
      "game/": ["flower", "tile", "farm", "player"]
    },
    "public/js/": ["asset-loader", "socket-manager", "ui-manager", "game"]
  }
};

window.onload = function () {
  JsLoader.loadTree(JS_DEPENDENCIES, function () {
    (new Game({
      url: URL,
      canvasID: "canvas",
      columns: 5,
      rows: 5
    })).init();
  });
}
