var Terrain = require('./terrain.js');
var Player  = require('./player.js');

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

    login(req){
    	let name = req.param.login;
    	let reponse = {};
    	let exist = false;
    	for (var i = 0; i < this.players.length; i++) {
    		if (this.players[i].name == name) {
    			exist = true;
    		}
    	}
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
}

module.exports = Game;