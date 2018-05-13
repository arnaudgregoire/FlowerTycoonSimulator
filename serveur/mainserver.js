const express    = require('express')
var cors         = require('cors')
const WebSocket  = require('ws');
const bodyParser = require("body-parser");
var Terrain      = require('./terrain.js');
var Game         = require('./game.js');
const delay      = require('delay');
let server       = require('http').createServer();
const PORT       = process.env.PORT || 8081;
var game;

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(express.static('client/'));

/**
 * Partie du serveur qui repond au demande de plantation de vegetation sur une case
 */
app.post('/planter', function (req, res) {
  console.log(req.body);
  let json = {};
  if(game.checkName(req.body)){
    json = game.planter(req.body);
  }
  else{
    json = game.destinationUnknown(); // DESTINATION UNKNOOWN KNOWWN KNWOOWNN (https://www.youtube.com/watch?v=z9CRvCmJUnI)
  }
  res.json(json);
  requestUpdateClients();
})

/**
 * Partie du serveur s occupant de l achat de cases
 */
app.post('/acheter', function (req, res) {
  console.log(req.body);
  let json = {};
  if(game.checkName(req.body)){
    json = game.acheter(req.body);
  }
  else{
    json = game.destinationUnknown(); // DESTINATION UNKNOOWN KNOWWN KNWOOWNN (https://www.youtube.com/watch?v=z9CRvCmJUnI)
  }
  res.json(json);
  requestUpdateClients();
})

/**
 * Partie du serveur qui s occupe de la connexion de nouveaux joueurs, plus generalement de la connexion des utilisateurs
 */
app.post('/login', function (req, res) {
  console.log(req.body);
  res.json(game.login(req.body));
  requestUpdateClients();
})

/**
 * Partie du serveur repondant aux demandes d informations du client
 */
app.post('/getPlayers', function (req, res) {
  console.log(req.body);
  res.json(game.getPlayers());
})

app.post('/getInventory', function (req, res) {
  console.log(req.body);
  res.json(game.getInventory(req.body));
})

app.post('/getTerrain', function (req, res) {
  console.log(req.body);
  res.json(game.terrain.toJSON());
})


/**
 * Methode pour commencer une partie appele juste au dessus a la creation du serveur
 */
function start() {
    game = new Game(24,5,10);
    update();
}

function update(){
  delay(1000)
    .then(() => {
        game.updateTerrain()
        update();
    });
}


let wss = new WebSocket.Server({ server : server });
server.on('request', app);


// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

function requestUpdateClients() {
    wss.broadcast(JSON.stringify({'reponse': 'update'}));
}

/**
 * Methode lancant le serveur
 */
server.listen(PORT, function () {
  start();
  console.log('listening on port ' + PORT);
})
