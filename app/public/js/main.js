"use strict";

const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/
const JS_DEPENDENCIES = [
  URL+"public/js/asset-loader.js", URL+"public/js/ui-manager.js", URL+"public/js/game.js",
  URL+"shared/game/seed.js",  // WARNING: This file seems to be unused
  URL+"shared/utils.js", URL+"shared/game/flower.js", URL+"shared/game/tile.js",
  URL+"shared/game/farm.js", URL+"shared/game/player.js"
];

var game, exampleSocket;

window.onload = function () {
  JsLoader.loadFile(JS_DEPENDENCIES, function () {
    initSocket();
    initGame();
  });
}


function initGame() {
  game = new Game(exampleSocket, {
    columns: 5,
    rows: 5
  });

  game.init();
}

function initSocket() {
  exampleSocket = new WebSocket("ws://" + URL);

  exampleSocket.onopen = function (event) {
    exampleSocket.send("Voici un texte que le serveur attend de recevoir dès que possible !");
  };

  exampleSocket.onmessage = function (event) {
    let json = JSON.parse(event.data);
    // TODO: CHANGE THIS
    if (json.reponse == "update") {
      game.update(0.016);
    }
  }
}

// TODO: CHANGE THIS, and put every communication with the server in a new class owned by the game object
function send(task,data) {
  return fetch("http://" + URL + task,{
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: data
  })
  .then((response) =>{
    if(response.ok){
      return response.json();
    }
  })
  .then((json) => {
    if(typeof json.description != "undefined"){
      informationManager.display(json.description);
    }
    return json;
  });
}
