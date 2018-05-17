"use strict";

// const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/
const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/ || file:///C:/Users/Augustin/Desktop/FlowerTycoonSimulator/app/
// C:Users\msawada\Desktop\flowerTycoonSimulator\app
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
  //JsLoader.loadTree(JS_DEPENDENCIES, function () {
    //(
      new Game({
      url: URL,
      canvasID: "canvas",
      columns: 5,
      rows: 5
    }).init();
  //});
}
