"use strict";

const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/
const JS_DEPENDENCIES = [
  "js/player.js", "js/opponent.js",    // delete soon
  URL+"public/js/asset-loader.js", URL+"public/js/login-manager.js", URL+"public/js/ui-manager.js",
  URL+"shared/game/seed.js", URL+"shared/game/flower.js", URL+"shared/game/tile.js", URL+"shared/game/player.js", URL+"shared/game/farm.js"
];

var game,
    player,
    farm,
    loginManager,
    uiManager,
    exampleSocket;


window.onload = function () {
  JsLoader.load(JS_DEPENDENCIES, function () {
    initSocket();
    initGame();
  });
}


function initGame() {
  loginManager = new LoginManager(window.document);
  uiManager    = new UIManager(window.document);

  loginManager.init();

  // TODO: put this event listener in the client game ?
  window.addEventListener("sendLogin", function (e) {
    tryLogin(e.detail);
  });
}

// TODO: This method should be part of the game object, only here for debug
function tryLogin(info) {
  console.log(info);


  // TODO: implement login logic here
  // let success = send(...)

  let success = true;
  if(success) {
    loginManager.remove();

    game = new Game()
    player = new Player();
    farm = new Farm();

    uiManager.setUsername(info.username);
  }
}

function initSocket() {
  exampleSocket = new WebSocket("ws://" + URL);

  exampleSocket.onopen = function (event) {
    exampleSocket.send("Voici un texte que le serveur attend de recevoir dès que possible !");
  };

  exampleSocket.onmessage = function (event) {
    let json = JSON.parse(event.data);
    if (json.reponse == "update") {
      terrain.getTerrain();
      playerManager.getPlayers();
    }
  }
}

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
