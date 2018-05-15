"use strict";

const URL = "localhost:8081/";  // flowertycoonsimulator.herokuapp.com/ ||  localhost:8081/
const JS_DEPENDENCIES = [
  "js/utl/asset-loader.js",
  "js/case.js", "js/flower.js", "js/player.js", "js/opponent.js", "js/plante.js", "js/seed.js", "js/terrain.js",
  "js/informationManager.js", "js/inventoryManager.js", "js/loginManager.js", "js/playerManager.js"
];

var player,
    loginManager,
    inventoryManager,
    playerManager,
    terrain,
    exampleSocket,
    informationManager;

var $plant_button, $harvest_button, $buy_button;


function initGame() {
  player             = new Player();
  loginManager       = new LoginManager();
  inventoryManager   = new InventoryManager();
  playerManager      = new PlayerManager();
  terrain            = new Terrain();
  informationManager = new InformationManager();
}

function initDOM() {
  $plant_button = document.querySelector("#plant-button");
  $harvest_button = document.querySelector("#harvest-button");
  $fertilize_button = document.querySelector("#fertilize-button");
  $buy_button = document.querySelector("#buy-button");

  $plant_button.addEventListener("click", function(){
    player.planter(player);
  });
  $buy_button.addEventListener("click", function(){
    player.acheter(player);
  });
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

window.onload = function () {
  var jsloader = new JsLoader();
  jsloader.load(JS_DEPENDENCIES, function () {
    initGame();
    initDOM();
    initSocket();
  });
}
