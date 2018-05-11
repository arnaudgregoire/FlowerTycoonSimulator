var utils = require('./utils.js');
var PlanteFactory = require("./plante/plantefactory.js");

class Player{
	constructor(name){
		this.name = name;
		this.money = 10;
		this.color = utils.getRandomColor();
		this.inventory = [];
		this.inventory.push(PlanteFactory.getRandomPlante());
	}
}

module.exports = Player;