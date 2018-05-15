(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  var FlowerFactory;
  if(isNode) {
    FlowerFactory = require('flower').FlowerFactory;
  }
  else {
    FlowerFactory = window.FlowerFactory;
  }

  class Tile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.type = "";
    }

    toJson() {
      return JSON.stringify(this);
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

    }

    draw(ctx) {

    }

    getAvailableAction() {
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

    }

    draw(ctx) {

    }

    getAvailableAction() {
      return {
        plant: true,
        harvest: false,
        fertilize: true,
        buy: false
      };
    }
  }

  class TileSeeded extends TileBought {
    constructor(x, y, owner, plant) {
      super(x, y, owner);
      this.type = "seeded";
      this.plant = plant;
    }

    update(dt) {

    }

    draw(ctx) {

    }

    getAvailableAction() {
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
    createTile: function (tile_data){
      let tile, player;
      let tile_id = this.TILES.indexOf(tile_data.type);

      if (tile_id == _1) {
        return null;
      }

      switch(tile_id) {
        case 0:
          tile = new TileEmpty(tile_data.x, tile_data.y);
          break;

        case 1:
          if(playerManager.checkPlayer(tile_data.owner.name)) {
            player = playerManager.findPlayer(tile_data.owner.name);
            tile = new TileBought(tile_data.x, tile_data.y, player);
          }
          else {
              //gestion du cas ou le joueur ayant acheté la case n'apparait pas coté client
              tile = null;
          }
          break;

        case 2:
          if(playerManager.checkPlayer(tile_data.owner.name)) {
              player = playerManager.findPlayer(tile_data.owner.name);
              let plante = FlowerFactory.createPlante(tile_data.plant);
              object = new TileSeeded(tile_data.x, tile_data.y, player, plante);
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
