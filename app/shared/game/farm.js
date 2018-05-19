(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  var TileEmpty;
  if(isNode) {
    TileEmpty = require("./tile.js").TileEmpty;
  }
  else {
    TileEmpty = window.TileEmpty;
  }

  /**
   * La classe Farm est instancié une seule fois et représente l'ensemble des parcelles.
   * Elle est constitué de Tile:
   * [[0 0 0]
   *  [0 0 0]
   *  [0 0 0]]
   * going through: rows (y), columns (x)
   */
  class Farm {
    constructor(columns, rows) {
      this.columns = columns;
      this.rows = rows;

      this.tiles = [];

      this.reset();
    }
    updateTiles(tiles){
      console.log(tiles);
    }

    update(dt) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.tiles[i][j].update(dt);
        }
      }
    }

    draw(ctx) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.tiles[i][j].draw(ctx);
        }
      }
    }

    reset() {
      this.tiles = new Array(this.rows);
      for (var i = 0; i < this.rows; i++) {
        this.tiles[i] = new Array(this.columns);
        for (var j = 0; j < this.columns; j++) {
          this.tiles[i][j] = new TileEmpty(j, i);
        }
      }
    }

    /**
  	 * La méthode toJSON est appelé dès qu'un client envoie une requete getTerrain
  	 */
  	toJSON(){
      let array = new Array(this.rows);
      for (var i = 0; i < this.rows; i++) {
        array[i] = new Array(this.columns);
        for (var j = 0; j < this.columns; j++) {
          array[i][j] = this.tiles[i][j];
        }
      }

      return {
        tiles: array
      };
  	}
  }

  if (isNode) {
    module.exports = Farm;
  }
  else {
    window.Farm = Farm;
  }

})();
