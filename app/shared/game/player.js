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
		constructor(id, name) {
      this.id = id;
			this.name = name;
			this.money = 100;
			this.score = 0;
			this.color = utils.getRandomColor();
			this.inventory = [];

      this.selectedTile = null;
      this.selectedItem = null;

			// this.inventory.push(FlowerFactory.getRandomPlante());
		}

    setSelectedTile(column, row) {
      this.selectedTile = {
        column: column,
        row: row
      };
    }

    setSelectedItem(item_id) {
      this.selectedItem = this.findItem(item_id);
    }

		hasItem(item_id) {
			for (let i = 0; i < this.inventory.length; i++) {
				if (this.inventory[i].id == item_id) {
					return true;
				}
			}
			return false;
		}

		findItem(item_id) {
			let object;
			for (let i = 0; i < this.inventory.length; i++) {
				if (this.inventory[i].id == item_id) {
					return this.inventory[i];
				}
			}
			return null;
		}

    removeItem(item) {
      this.inventory.splice(player.inventory.indexOf(item), 1);
    }
	}

  if (isNode) {
    module.exports = Player;
  }
  else {
    window.Player = Player;
  }

})();
