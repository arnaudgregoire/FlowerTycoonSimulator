var nanoid = require('nanoid');

var Farm = require('../shared/game/farm.js');
var Flower = require('../shared/game/flower.js');
var Tile = require('../shared/game/tile.js');
var Player = require('../shared/game/player.js');

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

    // Decode (encrypted) network messages

    // Perform players actions && update game objects

    // Send (encrypted) messages to clients about state changes
  }

  update() {
    for (var i = 0; i < this.player_list.length; i++) {
      this.player_list[i].update();
    }
    this.farm.update();
  }

  /**
  * Check if a player exist in the player_list, based on his ID
  */
  checkID(req){
    for (var i = 0; i < this.player_list.length; i++) {
      if (this.player_list[i].id == req.param.login) {
        return true;
      }
    }
    return false;
  }

  /**
  * Renvoie le joeur correspondant au nom compris dans la requete
  * @param {Request body} req
  */
  findPlayer(req){
    for (var i = 0; i < this.player_list.length; i++) {
      if (this.player_list[i].id == req.param.login) {
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

    let player = this.findPlayer(req);
    if(player == null) {
      json = {"response":1};
    }
    else {
      let x = parseInt(req.param.x);
      let y = parseInt(req.param.y);

      if (this.farm.tile[x][y].type == "empty") {
        if (player.money >= this.farm.tile[x][y].cost) {
          this.farm.tile[x][y] = new tile.TileBought(x, y, player);
          player.money -= this.farm.tile[x][y].cost;
          json = {"response":1, "description" : "La case a été achetée"};
        }
        else{
          json = {"response":0, "description" : "Pas assez d'argent"};
        }
      }
      else{
        json = {"response":0, "description" : "La case n'est pas vide"};
      }
    }
    return json;
  }

  /**
  * Methode appele lorsque que un joueur veut planter une case
  * @param {Request body} req
  *  Renvoie un json avec la reponse associe et une petite description de ce qui s est passe
  */
  plant(req){
    let json = {};

    let player = this.findPlayer(req);
    if(player == null) {
      json = {"response":1};
    }
    else {
      let x = parseInt(req.param.x);
      let y = parseInt(req.param.y);

      if (this.farm.tile[x][y].owner.id == player.id) {
        let id = req.param.flower.id;
        if(player.hasItem(id)){
          let flower = player.findItem(id);
          if(flower.plantable){
            flower.startLife();
            this.farm.tiles[x][y] = new tile.TileSeeded(x, y, player, flower);
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

    let login = req.param.login;
    let exist = this.checkName(login.username);
    if (exist) {
      if(this.checkPassword(login.password)) {
        json = {"response": 1, "description" : "Heureux de vous revoir"};
      }
      else{
        json = {"response": 0, "description" : "Mauvais mot de passe"};
      }
    }
    else{
      let id = nanoid();
      this.player_list.push(new Player(id, name));
      json = {"response": 1, "description" : "Votre compte a bien ete cree"};
    }
    return json;
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
    for (var i = 0; i < this.players.length; i++) {
      json.players.push({"name": this.players[i].name, "color": this.players[i].color,"score":this.players[i].score});
    }
    return json;
  }

  getInventory(req) {
    let name = req.param.login;
    let reponse = {"inventory" : [], "money" : 0};
    let exist = this.checkName(req);
    if (exist) {
      let player = this.findPlayer(req);
      reponse.money = player.money;
      for (let i = 0; i < player.inventory.length; i++) {
        reponse.inventory.push(player.inventory[i].toJSON());
      }
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
