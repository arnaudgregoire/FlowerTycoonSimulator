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
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
          this.tiles[y][x] = TileFactory.prototype.createTile(tiles[y][x], game);
        }
      }
    }

    update(dt) {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
          this.tiles[y][x].update(dt);
        }
      }
    }

    reset() {
      this.tiles = new Array(this.rows);
      for (let y = 0; y < this.rows; y++) {
        this.tiles[y] = new Array(this.columns);
        for (let x = 0; x < this.columns; x++) {
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

      if(tile.x >= 0 && tile.x < this.columns && tile.y >= 0 && tile.y < this.rows) {
        return this.tiles[tile.y][tile.x];
      }
      return null
    }

    selectTile(x, y) {
      let tile = this.getTile(x, y);
      if(tile != null) {
        console.log(tile);
        for (let y = 0; y < this.rows; y++) {
          for (let x = 0; x < this.columns; x++) {
            if(y == tile.y && x == tile.x) {
              this.tiles[y][x].selected = true;
            }
            else {
              this.tiles[y][x].selected = false;
            }
          }
        }
      }
      return tile;
    }

    draw(ctx) {
      let coord = null;
      for (let x = 0; x < this.columns; x++) {
        for (let y = 0; y < this.rows; y++) {
          coord = this.gridToScreen(x, y);
          this.tiles[y][x].draw(ctx, coord.x, coord.y, this.tile_width, this.tile_height);
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
      let x_ = Math.floor(d * (x*h + y*w - (this.offset_x*h + this.offset_y*w)));
      let y_ = Math.floor(d * (y*w - x*h + (this.offset_x*h - this.offset_y*w)));
      return {
        x: x_,
        y: y_
      };
    }

    checkTilesBelow(tile, x, y, n) {
      let new_tile = null, offset = 0;

      let tile_x = tile.x, tile_y = tile.y;
      for (let i = 1; i <= n; i++) {
        // bottom left tile
        if ((tile.x+i-1) >= 0 && (tile.x+i-1) < this.columns && (tile.y+i) < this.rows) {
          offset = this.tiles[tile.y + i][tile.x + i-1].offset;
          new_tile = this.screenToGrid(x, y + offset);
          if(new_tile.x >= (tile.x + i-1) && new_tile.y >= (tile.y + i)) {
            tile_x = tile.x + i-1;
            tile_y = tile.y + i;
          }
        }
        // bottom right tile
        if ((tile.x+i) < this.columns && (tile.y+i-1) >= 0 && (tile.y+i-1) < this.rows) {
          offset = this.tiles[tile.y + i-1][tile.x + i].offset;
          new_tile = this.screenToGrid(x, y + offset);
          if(new_tile.x >= (tile.x + i) && new_tile.y >= (tile.y + i-1)) {
            tile_x = tile.x + i;
            tile_y = tile.y + i-1;
          }
        }
        // bottom tile
        if ((tile.x+i) < this.columns && (tile.y+i) < this.rows) {
          offset = this.tiles[tile.y + i][tile.x + i].offset;
          new_tile = this.screenToGrid(x, y + offset);
          if(new_tile.x >= (tile.x + i) && new_tile.y >= (tile.y + i)) {
            tile_x = tile.x + i;
            tile_y = tile.y + i;
          }
        }
      }
      return {
        x: tile_x,
        y: tile_y
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
