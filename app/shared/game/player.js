(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

var FlowerFactory;
  if(isNode) {
		FlowerFactory = require("./flower.js").FlowerFactory;
  }
	else {
		FlowerFactory = window.FlowerFactory;
	}

	class Player{
		constructor(id, name, color) {
      this.id = id;
			this.name = name;
			this.money = 100;
			this.score = 0;
			this.color = color;
			this.inventory = [];

      this.selectedTile = null;
      this.selectedItem = null;
		}

    setSelectedTile(tile) {
      this.selectedTile = tile;
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
      this.inventory.splice(this.inventory.indexOf(item), 1);
    }
	}

  if (isNode) {
    module.exports = Player;
  }
  else {
    window.Player = Player;
  }

})();
