const express = require('express')
var cors = require('cors')
const bodyParser = require("body-parser");
var Terrain = require('./terrain.js');

let terrain = new Terrain();

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
  res.json({"reponse": 1})
})

app.post('/getPlayers', function (req, res) {
  console.log(req.body);
  let fonction = req.body.fonction;
  console.log(fonction);
  res.json({"players": [
    {name : "Amaury", color : "blue"},
    {name : "Ogus", color : "red"}
  ]})
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


app.listen(8081, function () {
  console.log('listening on port 8081!');
})
