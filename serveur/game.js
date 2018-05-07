var Terrain = require('./terrain.js');
var Player  = require('./player.js');
var EmptyCase = require('./case/emptyCase.js');
var BoughtCase = require('./case/boughtCase.js');

/**
 * L'instance Game représente la partie en cours :
 * un partie est composé de joueurs, d'un plateau d'une taille fixé ainsi que d'une durée fixé
 */
class Game{
    constructor(duree, tailleX, tailleY){
        this.duree = duree;
        this.players = [];
        this.terrain = new Terrain(tailleX, tailleY);
	}
	
	checkName(req){
		let exist = false;
    	for (var i = 0; i < this.players.length; i++) {
    		if (this.players[i].name == req.param.login) {
    			exist = true;
    		}
		}
		return exist;
	}

	findPlayer(req){
		let player;
		for (var i = 0; i < this.players.length; i++) {
    		if (this.players[i].name == req.param.login) {
    			player = this.players[i];
    		}
		}
		return player;
	}

	acheter(req){
		let player = this.findPlayer(req);
		let json = {};
		let x = req.param.x;
		let y = req.param.y;
		if (this.terrain.cases[x][y].type == "empty") {
			if (player.money >= EmptyCase.getCost()) {
				this.terrain.cases[x][y] = new BoughtCase(x,y,player);
				player.money -= EmptyCase.getCost();
				json = {"reponse":1, "description" : "La case a bien été acheté"};
			}
			else{
				json = {"reponse":0, "description" : "Pas assez d'argent"}
			}
		}
		else{
			json = {"reponse":0, "description" : "La case n'est pas vide"};
		}
		return json;
	}

	planter(req){

	}

    login(req){
    	let name = req.param.login;
    	let reponse = {};
    	let exist = this.checkName(req);
    	if (exist) {
    		if(this.checkPassword()){
    			reponse = {"reponse": 1, "description" : "Heureux de vous revoir"};
    		}
    		else{
    			reponse = {"reponse": 0, "description" : "Mauvais mot de passe"};
    		}
    	}
    	else{
    		this.players.push(new Player(name));
    		reponse = {"reponse": 1, "description" : "Votre compte a bien ete cree"};
    	}

    	return reponse;
    }

    checkPassword(){
    	return true;
    }

    getPlayers(){
    	let json = {"players": []};
    	for (var i = 0; i < this.players.length; i++) {
    		json.players.push({"name": this.players[i].name, "color": this.players[i].color});
    	}
    	return json;
	}

	destinationUnknown(){
		return {"reponse":0, "description" : "Please login first"};
	}
}

module.exports = Game;