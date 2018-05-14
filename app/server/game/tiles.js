(function () {
  "use strict";
  let isNode = (typeof module !== 'undefined' && typeof module.exports !== 'undefined');

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
  }

  class TileBought extends Tile {
    constructor(x, y, player) {
      super(x, y);
      this.type = "bought";
      this.player = player;
    }
  }

  class TileSeeded extends TileBought {
    constructor(x, y, player, plant) {
      super(x, y, player);
      this.type = "seeded";
      this.plant = plant;
    }
  }


  // Node export
  if (isNode) {
    module.exports = {
      Tile: Tile,
      TileEmpty: TileEmpty,
      TileBought: TileBought,
      TileSeeded: TileSeeded
    };
  }
  // Browser export
  else {
    window.Tile = Tile;
    window.TileEmpty = TileEmpty;
    window.TileBought = TileBought;
    window.TileSeeded = TileSeeded;
  }
})();
