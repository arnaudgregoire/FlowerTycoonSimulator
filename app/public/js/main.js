"use strict";

const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/
const JS_DEPENDENCIES = [
  "js/asset-loader.js",
  "js/player.js", "js/opponent.js", "js/playerManager.js",
  "js/login-manager.js", "js/ui-manager.js"
];

var game,
    player,
    farm,
    loginManager,
    uiManager,
    exampleSocket;


window.onload = function () {
  // var jsloader = new JsLoader();
  console.log(JsLoader);

  JsLoader.load(JS_DEPENDENCIES, function () {
    initSocket();
    initGame();
  });
}


function initGame() {
  // player       = new Player();
  // farm         = new Farm();
  loginManager = new LoginManager(window.document);
  uiManager    = new UIManager(window.document);

  loginManager.init();

  window.addEventListener("sendLogin", function (e) {
    tryLogin(e.detail);
  });

  // game = new Game();
  // game.start();
}

// TODO: This method should be part of the game object, only here for debug
function tryLogin(info) {
  console.log(info);

  let success = true;
  // TODO: implement login logic here
  // let success = send(...)

  if(success) {
    loginManager.remove();
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
