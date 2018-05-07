var utils = require('./utils.js');

class Player{
	constructor(name){
		this.name = name;
		this.money = 0;
		this.color = utils.getRandomColor();
	}
}

module.exports = Player;