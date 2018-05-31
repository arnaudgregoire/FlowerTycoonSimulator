var nanoid = require('nanoid');

var Farm = require('../shared/game/farm.js');
var FlowerFactory = require('../shared/game/flower.js').FlowerFactory;
var TileEmpty = require('../shared/game/tile.js').TileEmpty;
var TileBought = require('../shared/game/tile.js').TileBought;
var TileSeeded = require('../shared/game/tile.js').TileSeeded;
var Player = require('../shared/game/player.js');
var utils = require('../shared/utils.js');

/**
* L'instance Game représente la partie en cours :
* un partie est composé de joueurs, d'un plateau d'une taille fixé ainsi que d'une durée fixé
*/
class Game{
  constructor(server_config) {
    let config = server_config || {};

    this.columns = config.columns || 10;
    this.rows = config.rows || 10;

    this.client_url = config.url || "";
    this.farm = new Farm(this.columns, this.rows);
    this.player_list = [];

    this.duration = config.duration || 3600;

    this.then = 0;
    this.now = 0;

    this.loop();
  }

  loop() {
    // Handle client connection/disconnection

    // Decode (encrypted) network messagesd

    // Perform players actions && update game objects

    // Send (encrypted) messages to clients about state changes
  }

  update(dt) {
    this.farm.update(dt);
  }

  /**
  * Check if a player exist in the player_list, based on his ID
  */
  checkID(id){
    for (var i = 0; i < this.player_list.length; i++) {
      if (this.player_list[i].id == id) {
        return true;
      }
    }
    return false;
  }

  checkName(name){
    for (var i = 0; i < this.player_list.length; i++) {
      if (this.player_list[i].name == name) {
        return true;
      }
    }
    return false;
  }

  /**
  * Renvoie le joeur correspondant au nom compris dans la requete
  * @param {Request body} req
  */
  findPlayerById(id){
    for (var i = 0; i < this.player_list.length; i++) {
      if (this.player_list[i].id == id) {
        return this.player_list[i];
      }
    }
    return null;
  }

  findPlayerByName(username){
    for (var i = 0; i < this.player_list.length; i++) {
      if (this.player_list[i].name == username) {
        return this.player_list[i];
      }
    }
    return null;
  }

  /**
  * Methode appele lorsque que un joueur veut acheter une case
  * @param {Request body} req
  * Renvoie un json avec la reponse associe et une petite description de ce qui s est passe
  */
  buy(req){
    let json = {};
    let player = this.findPlayerById(req.param.player.id);
    let x = parseInt(req.param.tile.x);
    let y = parseInt(req.param.tile.y);
    if (this.farm.tiles[y][x].type == "empty") {
      if (player.money >= this.farm.tiles[y][x].cost) {
        //console.log(this.farm.tiles[x][y].cost);
        player.money -= this.farm.tiles[y][x].cost;
        this.farm.tiles[y][x] = new TileBought(x, y, player);
        json = {"response":1, "description" : "La case a été achetée"};
      }
      else{
        json = {"response":0, "description" : "Pas assez d'argent"};
      }
    }
    else{
      json = {"response":0, "description" : "La case n'est pas vide"};
    }
    //console.log(this.farm.tiles);
    return json;
  }

  /**
  * Methode appele lorsque que un joueur veut planter une case
  * @param {Request body} req
  *  Renvoie un json avec la reponse associe et une petite description de ce qui s est passe
  */
  plant(req){
    let json = {};

    let player = this.findPlayerById(req.param.player.id);
    let x = parseInt(req.param.tile.x);
    let y = parseInt(req.param.tile.y);

    if (this.farm.tiles[y][x].owner.id == player.id) {
      let id = req.param.flower.id;
      if(player.hasItem(id)){
        let flower = player.findItem(id);
        if(flower.plantable){
          flower.startLife();
          this.farm.tiles[y][x] = new TileSeeded(x, y, player, flower);
          player.removeItem(flower);
          json = {"reponse": 1, "description" : "La plante a ete plantee"};
        }
        else{
          json = {"reponse": 0, "description" : "La plante ne peut pas etre plantee"};
        }
      }
      else{
        json = {"reponse": 0, "description" : "Vous ne possedez pas l objet"};
      }
    }
    else{
      json = {"reponse":0, "description" : "Vous ne possedez pas la case"};
    }
    return json;
  }

  harvest(req){
    let json = {};
    let player = this.findPlayerById(req.param.player.id);
    let tile = this.farm.tiles[req.param.tile.y][req.param.tile.x];
    console.log(tile);
    if (tile.type == "seeded") {
      if(tile.owner.id == player.id){
        player.inventory.push(tile.flower);
        this.farm.tiles[req.param.tile.y][req.param.tile.x] = new TileBought(tile.x, tile.y, player);
        json = {"reponse":1, "description": "La plante a été transféré dans l'inventaire"};
      }
      else{
        json = {"reponse":0, "description": "Vous n'êtes pas propriétaire de la case"};
      }
    }
    else{
      json = {"reponse":0, "description": "Aucune fleur détecté sur la case"};
    }
    return json;
  }

  /**
  * Methode appele lorsque que un joueur veut se connecter
  * @param {Request body} req
  *  Renvoie un json avec la reponse associe et une petite description de ce qui s est passe
  */
 login(req) {
  let json = {};
  let login = req.param;
  let exist;
  if (req.param.player.hasOwnProperty("username")){
    exist = this.checkName(req.param.player.username);
  }
  else{
    exist = false;
  }
  let player; 
  if (exist) {
    player = this.findPlayerByName(req.param.player.username);
    if(this.checkPassword(login.password)) {
      json = {"response": 1, "description" : "Heureux de vous revoir", "player": {"name": player.name, "id":player.id}};
    }
    else{
      json = {"response": 0, "description" : "Mauvais mot de passe"};
    }
  }
  else{
    let id = nanoid();
    let player = new Player(id,req.param.player.username,utils.getRandomColor());
    this.addNewPlayer(player);
    json = {"response": 1, "description" : "Votre compte a bien ete cree", "player": {"name": player.name, "id":player.id}};
  }
  return json;
}

  addNewPlayer(player){
    this.player_list.push(player);
    player.inventory.push(FlowerFactory.prototype.getRandomFlower());
  }

  /**
  * Verifie si le password donne en entree correpond bien ( potentiellement passer des parametres en plus)
  */
  checkPassword(password) {
    // Decode password
    return true;
  }

  /**
  * Renvoie la liste des joueurs enregistres sur le serveur sous format json
  */
  getPlayers() {
    let json = {"players": []};
    for (var i = 0; i < this.player_list.length; i++) {
      json.players.push({
        "id":this.player_list[i].id,
        "username": this.player_list[i].name,
        "color": this.player_list[i].color
      });
    }
    return json;
  }

  getInventory(req) {
    let id = req.param.player.id;
    let reponse = {"inventory" : [], "money" : 0};
    let exist = this.checkID(id);
    if (exist) {
      let player = this.findPlayerById(id);
      reponse.money = player.money;
      reponse.inventory = player.inventory;
    }
    else{
      reponse = this.destinationUnknown();
    }
    return reponse;
  }

  /**
  * Methode appele quand le serveur ne connait pas le login ou que le login est manquant
  */
  destinationUnknown(){
    return {"reponse":0, "description" : "Please login first"};
  }
}

module.exports = Game;
