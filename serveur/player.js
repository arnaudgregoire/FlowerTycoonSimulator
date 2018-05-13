var utils = require('./utils.js');
var PlanteFactory = require("./plante/plantefactory.js");

class Player{
	constructor(name){
		this.name = name;
		this.money = 100;
		this.score = 0;
		this.color = utils.getRandomColor();
		this.inventory = [];
		this.inventory.push(PlanteFactory.getRandomPlante());
	}

	checkObject(id){
		let exist = false;
		for (let i = 0; i < this.inventory.length; i++) {
			if (this.inventory[i].id == id) {
				exist = true;
			}
		}
		return exist;
	}

	findObject(id){
		let object;
		for (let i = 0; i < this.inventory.length; i++) {
			if (this.inventory[i].id == id) {
				object = this.inventory[i];
			}
		}
		return object;
	}
}

module.exports = Player;