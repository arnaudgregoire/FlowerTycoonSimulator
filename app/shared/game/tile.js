(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

  var PlantFactory;
  if(isNode) {
    PlantFactory = require('./plant.js').PlantFactory;

  }
  else {
    PlantFactory = window.PlantFactory;
  }

  class Tile {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.type = "";
      this.img = null;
      this.offset = 0;
      this.selected = false;
    }

    getType() {
      return this.type;
    }

    drawSelected(ctx, x, y, width, height) {
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y); // top
      ctx.lineTo(x + width*0.5, y + height*0.5);  // right
      ctx.lineTo(x, y + height);  // bottom
      ctx.lineTo(x - width*0.5, y + height*0.5);  // left
      ctx.lineTo(x, y);
      ctx.fill();
    }
  }

  class TileEmpty extends Tile {
    constructor(x, y) {
      super(x, y);
      this.type = "empty";
      this.cost = 10;
      this.offset = 15;
    }

    update(dt) {
      //
    }

    draw(ctx, x, y, width, height) {
      ctx.drawImage(ImgLoader.get("grass"), x-width*0.5, y-this.offset, width, height+this.offset);
      if(this.selected) {
        this.drawSelected(ctx, x, y-this.offset, width, height);
      }
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
      this.offset = 8;
    }

    update(dt) {
      //
    }

    draw(ctx, x, y, width, height) {
      ctx.drawImage(ImgLoader.get("dirt"), x-width*0.5, y-this.offset, width, height+this.offset);
      if(this.selected) {
        this.drawSelected(ctx, x, y-this.offset, width, height);
      }
      this.drawBorder(ctx, x, y-this.offset, width, height, this.owner.color);
    }

    drawBorder(ctx, x, y, width, height, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.lineCap = "square";
      ctx.beginPath();
      ctx.moveTo(x, y+ctx.lineWidth*0.5); // top
      ctx.lineTo(x + width*0.5-ctx.lineWidth, y + height*0.5);  // right
      ctx.lineTo(x, y + height-ctx.lineWidth*0.5);  // bottom
      ctx.lineTo(x - width*0.5+ctx.lineWidth, y + height*0.5);  // left
      ctx.lineTo(x, y+ctx.lineWidth*0.5);
      ctx.stroke();
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
    constructor(x, y, owner, plant) {
      super(x, y, owner);
      this.type = "seeded";
      this.plant = plant;
    }

    update(dt) {
      this.plant.update(dt);
    }

    draw(ctx, x, y, width, height) {
      super.draw(ctx, x, y, width, height);
      let img = this.plant.getAsset();
      let w = img.width, h = img.height;
      ctx.drawImage(img, x-(w*0.5), y-this.offset+(height-h)*0.5, w, h);
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
              let plante = PlantFactory.prototype.createPlantFromData(tile_data.plant);
              console.log(plante);
              //console.log(tile_data.Plant);
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
