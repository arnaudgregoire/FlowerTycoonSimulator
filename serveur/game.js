var Terrain = require('./terrain.js');
var Player  = require('./player.js');
var EmptyCase = require('./case/emptyCase.js');
var BoughtCase = require('./case/boughtCase.js');
var PlantedCase = require('./case/plantedCase');

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
	
	/**
	* Regarde si le nom d'un joueur donne en entree coresspond au nom d un des objets Player de la liste players 
	*/
	checkName(req){
		let exist = false;
    	for (var i = 0; i < this.players.length; i++) {
    		if (this.players[i].name == req.param.login) {
    			exist = true;
    		}
		}
		return exist;
	}

	/**
	 * Renvoie le joeur correspondant au nom compris dans la requete
	 * @param {Request body} req 
	 */
	findPlayer(req){
		let player;
		for (var i = 0; i < this.players.length; i++) {
    		if (this.players[i].name == req.param.login) {
    			player = this.players[i];
    		}
		}
		return player;
	}

	/**
	 * Methode appele lorsque que un joueur veut acheter une case
	 * @param {Request body} req 
	 * Renvoie un json avec la reponse associe et une petite description de ce qui s est passe
	 */
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

	/**
	 * Methode appele lorsque que un joueur veut planter une case
	 * @param {Request body} req 
	 *  Renvoie un json avec la reponse associe et une petite description de ce qui s est passe
	 */
	planter(req){
		//console.log(req);
		let player = this.findPlayer(req);
		let json = {};
		let x = req.param.x;
		let y = req.param.y;
		let id = req.param.plante.id;
		if (this.terrain.cases[x][y].owner == player) {
			if(player.checkObject(id)){
				let plante = player.findObject(id);
				if(plante.plantable){
					this.terrain.cases[x][y] = new PlantedCase(x,y,player,plante);
					player.inventory.splice( player.inventory.indexOf(plante), 1 );
					json = {"reponse":1, "description" : "La plante a ete plantee"};
				}
				else{
					json = {"reponse":0, "description" : "La plante ne peut pas etre plantee"};
				}
			}
			else{
				json = {"reponse":0, "description" : "Vous ne possedez pas l objet"};
			}
		}
		else{
			json = {"reponse":0, "description" : "Vous ne possedez pas la case"};
		}
		return json;
	}

	/**
	 * Methode appele lorsque que un joueur veut se connecter
	 * @param {Request body} req 
	 *  Renvoie un json avec la reponse associe et une petite description de ce qui s est passe
	 */	
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

	/**
	 * Verifie si le password donne en entree correpond bien ( potentiellement passer des parametres en plus)
	 */
    checkPassword(){
    	return true;
    }

	/**
	 * Renvoie la liste des joueurs enregistres sur le serveur sous format json
	 */
    getPlayers(){
    	let json = {"players": []};
    	for (var i = 0; i < this.players.length; i++) {
    		json.players.push({"name": this.players[i].name, "color": this.players[i].color,"score":this.players[i].score});
    	}
    	return json;
	}

	getInventory(req){
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