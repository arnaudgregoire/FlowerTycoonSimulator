(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  var FlowerFactory;
  if(isNode) {
    FlowerFactory = require('./flower.js').FlowerFactory;

  }
  else {
    FlowerFactory = window.FlowerFactory;
  }

  class Tile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 40;
      this.type = "";
    }

    getType() {
      return this.type;
    }
  }

  class TileEmpty extends Tile {
    constructor(x, y) {
      super(x, y);
      this.type = "empty";
      this.cost = 10;
    }

    update(dt) {
      //
    }

    draw(ctx) {
      let img = window.AssetLoader.get("public/assets/tile/grass.png")
      ctx.drawImage(img, 0, 0, 64, 64, this.y * this.size, this.x * this.size, this.size, this.size);
    }

    getAvailableActions() {
      return {
        plant: false,
        harvest: false,
        fertilize: false,
        buy: true
      };
    }
  }

  class TileBought extends Tile {
    constructor(x, y, owner) {
      super(x, y);
      this.type = "bought";
      this.owner = owner;
    }

    update(dt) {
      //
    }

    draw(ctx) {
      let img = window.AssetLoader.get("public/assets/tile/labours.png");
      console.log(img);
      ctx.drawImage(img, 0, 0, 64, 64, this.y * this.size, this.x * this.size, this.size, this.size);
    }

    getAvailableActions() {
      return {
        plant: true,
        harvest: false,
        fertilize: true,
        buy: false
      };
    }
  }

  class TileSeeded extends TileBought {
    constructor(x, y, owner, flower) {
      super(x, y, owner);
      this.type = "seeded";
      this.flower = flower;
    }

    update(dt) {
      //
    }

    draw(ctx) {
      super.draw(ctx);
      let img = window.AssetLoader.get(this.flower.assetPath);
      ctx.drawImage(img, 0, 0, 64, 64, this.y * this.size, this.x * this.size, this.size, this.size);
    }

    getAvailableActions() {
      return {
        plant: false,
        harvest: true,
        fertilize: true,
        buy: false
      };
    }
  }



  var TileFactory = {
    TILES: ["empty", "bought", "seeded"]
  };
  TileFactory.prototype = {
    createTile: function (tile_data, game) {
      //console.log(tile_data);
      let tile, player;
      let tile_id = TileFactory.TILES.indexOf(tile_data.type);

      switch(tile_id) {
        case 0:
          tile = new TileEmpty(tile_data.x, tile_data.y);
          break;

        case 1:
          //console.log(tile_data);
          if(game.checkID(tile_data.owner.id)) {
            player = game.findPlayerById(tile_data.owner.id);
            tile = new TileBought(tile_data.x, tile_data.y, player);
          }
          else {
              //gestion du cas ou le joueur ayant acheté la case n'apparait pas coté client
              tile = null;
          }
          break;

        case 2:
          if(game.checkID(tile_data.owner.id)) {
              player = game.findPlayerById(tile_data.owner.id);
              let plante = FlowerFactory.prototype.createFlowerFromData(tile_data.flower);
              console.log(plante);
              console.log(tile_data.flower);
              tile = new TileSeeded(tile_data.x, tile_data.y, player, plante);
          }
          else{
              //gestion du cas ou le joueur ayant acheté la case n'apparait pas coté client
              tile = null;
          }
          break;
      }
      return tile;
    }
  }


  // Node export
  if (isNode) {
    module.exports = {
      Tile: Tile,
      TileEmpty: TileEmpty,
      TileBought: TileBought,
      TileSeeded: TileSeeded,
      TileFactory: TileFactory
    };
  }
  // Browser export
  else {
    window.Tile = Tile;
    window.TileEmpty = TileEmpty;
    window.TileBought = TileBought;
    window.TileSeeded = TileSeeded;
    window.TileFactory = TileFactory;
  }
})();
