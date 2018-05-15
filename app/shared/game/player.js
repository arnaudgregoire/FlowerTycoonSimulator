(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

	var utils, FlowerFactory;
  if(isNode) {
		utils = require('utils.js');
		FlowerFactory = require("flower").FlowerFactory;
  }
	else {
		utils = window.Utility;
		FlowerFactory = window.FlowerFactory;
	}

	class Player{
		constructor(id, name){
      this.id = id;
			this.name = name;
			this.money = 100;
			this.score = 0;
			this.color = utils.getRandomColor();
			this.inventory = [];
			this.inventory.push(FlowerFactory.getRandomPlante());
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

  if (isNode) {
    module.exports = Player;
  }
  else {
    window.Player = Player;
  }

})();
