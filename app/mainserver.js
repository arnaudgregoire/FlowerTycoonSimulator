var express    = require('express');
var http       = require("http");
var cors       = require('cors');
var WebSocket  = require('ws');
var bodyParser = require("body-parser");
var delay      = require('delay');

var Game       = require('./server/game.js');
var DbManager  = require('./server/dbManager.js');
var Player     = require('./shared/game/player.js');
var utils      = require('./shared/utils.js');

var game;
var dbManager;

const PORT     = process.env.PORT || 8081;

var app = express();
var server = http.createServer();

app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
app.use('/shared',express.static(__dirname + '/shared'));

app.use(function bodyLog(req, res, next) {
  console.log(req.body);
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
  next();
});

/**
 * Lancement du serveur
 */
server.listen(PORT, function () {
  console.log('listening on port:', PORT);
  start();
});

// Routage du client vers la page principale
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/loginPage', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/registerPage', function(req, res) {
  res.sendFile(__dirname + '/public/register.html');
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/public/game.html');
});

app.post('/whoAmI', function (req, res) {
  let json = {};
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
  console.log(game.player_list);
  let playerFound = game.findPlayerByIp(ip);
  json = {
          player:
            {
              "id":playerFound.id,
             "name":playerFound.name
            }
          }
  res.json(json);

});

app.post('/sell', function (req, res) {
  let json = {};
  if(game.checkID(req.body.param.player.id)){
    json = game.sell(req.body);
  }
  else{
    json = game.destinationUnknown(); 
  }
  res.json(json);
  requestUpdateClients();
});

app.post('/purchase', function (req, res) {
  let json = {};
  if(game.checkID(req.body.param.player.id)){
    json = game.purchase(req.body);
  }
  else{
    json = game.destinationUnknown(); 
  }
  res.json(json);
});

/**
 * Partie du serveur qui repond au demande de plantation de vegetation sur une case
 */
app.post('/plant', function (req, res) {
  let json = {};
  if(game.checkID(req.body.param.player.id)){
    json = game.plant(req.body);
  }
  else{
    json = game.destinationUnknown(); 
  }
  res.json(json);
  requestUpdateClients();
});

/**
 * Partie du serveur s occupant de l achat de cases
 */
app.post('/buy', function (req, res) {
  let json = {};
  if(game.checkID(req.body.param.player.id)){
    json = game.buy(req.body);
  }
  else{
    json = game.destinationUnknown(); 
  }
  res.json(json);
  requestUpdateClients();
});


/**
 * Partie du serveur s occupant de la récolte des fleurs
 */
app.post('/harvest', function (req, res) {
  let json = {};
  if(game.checkID(req.body.param.player.id)){
    json = game.harvest(req.body);
  }
  else{
    json = game.destinationUnknown(); 
  }
  res.json(json);
  requestUpdateClients();
});

/**
 * Partie du serveur qui s occupe de la connexion de nouveaux joueurs, plus generalement de la connexion des utilisateurs
 */
app.post('/login', function (req,res) {
  dbManager.login(req.body).then((rep)=>{
    console.log(rep);
    if(rep.response == 1){
      let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      let player = new Player(rep.player.id,rep.player.name,utils.getRandomColor(), 0, ip);
      if(!game.checkID(player.id)){
      game.addNewPlayer(player);
      }
    }
    res.json(rep);
    requestUpdateClients();
  })
});

/**
 * Partie du serveur qui s'occupe de la fertilisation des cases
 */
app.post('/fertilize', function (req,res) {
  let json = {};
  if(game.checkID(req.body.param.player.id)){
    json = game.fertilize(req.body);
  }
  else{
    json = game.destinationUnknown(); 
  }
  res.json(json);
  requestUpdateClients();
});


app.post('/register', function(req,res){
  dbManager.register(req.body).then((rep)=>{
    res.json(rep);
    requestUpdateClients();
  })
})

/**
 * Partie du serveur repondant aux demandes d informations du client
 */
app.post('/getPlayers', function (req, res) {
  res.json(game.getPlayers());
});

app.post('/getInventory', function (req, res) {
  res.json(game.getInventory(req.body));
});

app.post('/getFarm', function (req, res) {
  res.json(game.farm.toJSON());
});

app.post('/getBouquets', function (req, res) {
  res.json(game.bouquets);
});
/**
 * Methode pour commencer une partie appele juste au dessus a la creation du serveur
 */
function start() {
  game = new Game(24,5,10);
  dbManager = new DbManager();
  update();
}

function update(){
  delay(1000).then(() => {
    game.update(1000);
    update();
  });
}

// TODO: Change WebSocket to Socket.io


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
    wss.broadcast(JSON.stringify({'response': 'update'}));
}
