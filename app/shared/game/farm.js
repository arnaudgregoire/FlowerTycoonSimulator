(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  var TileEmpty;
  if(isNode) {
    TileEmpty = require("tiles.js").TileEmpty;
  }
  else {
    TileEmpty = window.TileEmpty;
  }

  /**
   * La classe Farm est instancié une seule fois et représente l'ensemble des parcelles.
   * Elle est constitué de Tile
   */
  class Farm {
    constructor(width, height) {
      this.width = width;
      this.height = height;

      this.tiles = new Array(this.width);
      for (var i = 0; i < this.width; i++) {
        this.tiles[i] = new Array(this.height);
        for (var j = 0; j < this.height; j++) {
          this.tiles[i][j] = new TileEmpty(x, y);
        }
      }
    }

    /**
  	 * La méthode toJSON est appelé dès qu'un client envoie une requete getTerrain
  	 */
  	toJSON(){
      let array = new Array(this.width);
      for (var i = 0; i < this.width; i++) {
        array[i] = new Array(this.height);
        for (var j = 0; j < this.height; j++) {
          array[i][j] = this.tiles[i][j].toJson();
        }
      }

      return {
        cases: array
      };
  	}
  }

  if (isNode) {
    module.export = Farm;
  }
  else {
    window.Farm = Farm;
  }

})();
