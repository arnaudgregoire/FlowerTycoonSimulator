const express = require('express')
var cors = require('cors')
const bodyParser = require("body-parser");
var Terrain = require('./terrain.js');
var Game = require('./game.js');

var game;

const app = express()

app.use(cors())
app.use(bodyParser.json());

app.post('/planter', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"reponse": 1})
})

app.post('/acheter', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"reponse": 1})
})

app.post('/login', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json(game.login(req.body));
})

app.post('/getPlayers', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json(game.getPlayers());
})

app.post('/getInventory', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"inventory": [
    {type : "seed", name : "Graine de tulipe"},
    {type : "flower", name : "Fleur de tournesol"}
  ]})
})

app.post('/getTerrain', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json(game.terrain.toJSON());
})

app.listen(8081, function () {
  start();
  console.log('listening on port 8081!');
})

function start() {
    game = new Game(24,5,10);
}