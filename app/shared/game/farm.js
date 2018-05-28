(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  var TileEmpty, TileBought, TileFactory;
  if(isNode) {
    TileEmpty = require("./tile.js").TileEmpty;
    TileBought = require("./tile.js").TileBought;
    TileFactory = require('./tile.js').TileFactory;
  }
  else {
    TileEmpty = window.TileEmpty;
    TileBought = window.TileBought;
    TileFactory = window.TileFactory;
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

      this.tile_width = 0;
      this.tile_height = 0;
      this.offset_x = 0;
      this.offset_y = 0;

      this.reset();
    }

    getWidth() {
      return this.columns * this.tile_width;
    }

    getHeight() {
      return this.rows * this.tile_height;
    }

    setTileDimensions(width, height, type) {
      let w = parseInt(width), h = parseInt(height);
      if(!isNaN(w) && !isNaN(h)) {
        if(String(type) === "cartesian") {
          this.tile_width = w*2;
          this.tile_height = h;
        }
        else {
          this.tile_width = w;
          this.tile_height = h;
        }
      }
    }

    setOffset(off_x, off_y) {
      let dx = parseInt(off_x);
      if(!isNaN(dx)) {
        this.offset_x = dx;
      }
      let dy = parseInt(off_y);
      if(!isNaN(dy)) {
        this.offset_y = dy;
      }
    }

    updateTiles(tiles, game){
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.tiles[i][j] = TileFactory.prototype.createTile(tiles[i][j], game);
        }
      }
    }

    update(dt) {
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
          this.tiles[i][j].update(dt);
        }
      }
    }

    reset() {
      this.tiles = new Array(this.rows);
      for (var y = 0; y < this.rows; y++) {
        this.tiles[y] = new Array(this.columns);
        for (var x = 0; x < this.columns; x++) {
          this.tiles[y][x] = new TileEmpty(x, y) ;
        }
      }
    }

    /**
  	 * La méthode toJSON est appelé dès qu'un client envoie une requete getTerrain
  	 */
  	toJSON(){
      return {tiles: this.tiles};
  	}


    getTile(x, y) {
      let tile = this.screenToGrid(x, y);
      tile = this.checkTilesBelow(tile, x, y, 2);

      if(tile.row >= 0 && tile.row < this.rows && tile.column >= 0 && tile.column < this.columns) {
        return this.tiles[tile.row][tile.column];
      }
      return null
    }

    selectTile(x, y) {
      let tile = this.getTile(x, y);
      if(tile != null) {
        console.log(tile);
        for (let r = 0; r < this.rows; r++) {
          for (let c = 0; c < this.columns; c++) {
            if(r == tile.y && c == tile.x) {
              this.tiles[r][c].selected = true;
            }
            else {
              this.tiles[r][c].selected = false;
            }
          }
        }
      }
      return tile;
    }

    draw(ctx) {
      let coord = null;
      let x = 0, y = 0;
      for (let i = 0; i < this.columns; i++) {
        for (let j = 0; j < this.rows; j++) {
          coord = this.gridToScreen(i, j);
          this.tiles[j][i].draw(ctx, coord.x, coord.y, this.tile_width, this.tile_height);
        }
      }
    }

    gridToScreen(column, row) {
      let w = this.tile_width, h = this.tile_height;
      return {
        x: column*w*0.5 - row*w*0.5 + this.offset_x,
        y: column*h*0.5 + row*h*0.5 + this.offset_y
      };
    }

    screenToGrid(x, y) {
      let w = this.tile_width*0.5, h = this.tile_height*0.5;
      let d = 1 / (2*w*h);
      let c = Math.floor(d * (x*h + y*w - (this.offset_x*h + this.offset_y*w)));
      let r = Math.floor(d * (y*w - x*h + (this.offset_x*h - this.offset_y*w)));
      return {
        column: c,
        row: r
      };
    }

    checkTilesBelow(tile, x, y, n) {
      let new_tile = null, offset = 0;

      let col = tile.column, row = tile.row;
      for (let i = 1; i <= n; i++) {
        // bottom left tile
        if ((tile.column+i-1) >= 0 && (tile.column+i-1) < this.columns && (tile.row+i) < this.rows) {
          offset = this.tiles[tile.row + i][tile.column + i-1].offset;
          new_tile = this.screenToGrid(x, y + offset);
          if(new_tile.column >= (tile.column + i-1) && new_tile.row >= (tile.row + i)) {
            col = tile.column + i-1;
            row = tile.row + i;
          }
        }
        // bottom right tile
        if ((tile.column+i) < this.columns && (tile.row+i-1) >= 0 && (tile.row+i-1) < this.rows) {
          offset = this.tiles[tile.row + i-1][tile.column + i].offset;
          new_tile = this.screenToGrid(x, y + offset);
          if(new_tile.column >= (tile.column + i) && new_tile.row >= (tile.row + i-1)) {
            col = tile.column + i;
            row = tile.row + i-1;
          }
        }
        // bottom tile
        if ((tile.column+i) < this.columns && (tile.row+i) < this.rows) {
          offset = this.tiles[tile.row + i][tile.column + i].offset;
          new_tile = this.screenToGrid(x, y + offset);
          if(new_tile.column >= (tile.column + i) && new_tile.row >= (tile.row + i)) {
            col = tile.column + i;
            row = tile.row + i;
          }
        }
      }
      return {
        column: col,
        row: row
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
