(function () {
  "use strict";

  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame;
    })();

  class Game {
    constructor(user_config) {
      let config = user_config || {};

      this.container = null;
      this.canvas_id = config.canvasID || "canvas";
      this.canvas = null;
      this.ctx = null;

      this.columns = config.columns || 10;
      this.rows = config.rows || 10;
      this.TILE_SIZE = 40;
      this.width = this.TILE_SIZE * this.columns;
      this.height = this.TILE_SIZE * this.rows;

      this.server_url = config.url || "";
      this.socket_manager = null;
      this.ui_manager = null;

      this.farm = null;
      this.player_list = null;
      this.player = null;
    }

    init() {
      this.canvas = document.getElementById(this.canvas_id);
      this.container = this.canvas.parentElement;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.farm = new Farm(this.columns,this.rows);
      this.player_list = [];

      this.socket_manager = new SocketManager(this.server_url);
      this.ui_manager = new UIManager();
      this.initEventListener();

      // AssetLoader.load([ ]);
  		// ResourcesLoader.onReady(function(){
  		// 	this.ui_manager.toggleLogin();
  		// }.bind(this));
      this.ui_manager.toggleLogin();
    }

    initEventListener() {
      window.addEventListener("resize", function () {
  			this.resizeCanvas();
  		}.bind(this), false);

      window.addEventListener("sendLogin", function (e) {
        this.handleLogin(e.detail);
      }.bind(this), false);

      this.canvas.addEventListener("click", function (e) {
        this.handleCanvasClick(e);
      }.bind(this), false);

      window.addEventListener("plantClick", function (e) {
        this.handlePlantEvent(e);
      }, false);

      window.addEventListener("harvestClick", function (e) {
        this.handleHarvestEvent(e);
      }, false);

      window.addEventListener("fertilizeClick", function (e) {
        this.handleFertilizeEvent(e);
      }, false);

      window.addEventListener("buyClick", function (e) {
        this.handleBuyEvent(e);
      }, false);

      window.addEventListener("inventoryClick", function (e) {
        let item_id = e.detail.id;
        if(this.player.hasItem(item_id)) {
          this.player.setSelectedItem(item_id);
        }
      }, false);

      window.addEventListener("updateGame", function () {
        this.update();
      }.bind(this), false);

      window.addEventListener("displayInfo", function (e) {
        this.ui_manager.displayInfo(e.detail);
      }.bind(this), false);
    }

    update() {
      this.socket_manager.sendMessage('getPlayers',{},this.updatePlayer_list);
      this.farm.update();
      this.farm.draw(this.ctx);

      this.ui_manager.updateBoard(this.player_list);
      this.ui_manager.updateInventory(this.player);
    }

    updatePlayer_list(json){
      console.log('json');
    }

    resizeCanvas() {
      let w = this.container.clientWidth;
      let h = this.container.clientHeight;

      let style = window.getComputedStyle(this.container, null);
      h -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      w -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

      let screenHeight, screenWidth;
      if((w/h) > (this.width/this.height)) {   // get the best game ratio
        screenHeight = h;
        screenWidth = screenHeight * this.width/this.height;
      }
      else {
        screenWidth = w;
        screenHeight = screenWidth * this.height/this.width;
      }

      this.canvas.style.height = String(screenHeight)+"px";
      this.canvas.style.width = String(screenWidth)+"px";
    }

    handleLogin(info) {
      console.log(info);
      // TODO: implement login logic here
      // let success = send(...)

      let success = true;
      if(success) {
        this.width = this.TILE_SIZE * this.columns;
        this.height = this.TILE_SIZE * this.rows;
        this.farm = new Farm(this.columns, this.rows);

        this.player_list = [];

        this.player = new Player(0, info.username);
        console.log(this.player);
        this.ui_manager.setInfo(this.player);

        this.resizeCanvas();
        this.ui_manager.toggleLogin();
        this.update();
      }
    }

    handlePlantEvent(e) {
      if(this.player.selectedTile != null && this.player.selectedItem != null) {
        //TODO: Plant a new flower on the selected tile, and ask server
        this.player.selectedTile = null;
        this.player.selectedItem = null;
      }
    }

    handleHarvestEvent(e) {
      if(this.player.selectedTile != null) {
        //TODO: Harvest the selected tile, and ask server
        this.player.selectedTile = null;
      }
    }

    handleFertilizeEvent(e) {
      if(this.player.selectedTile != null) {
        //TODO: Fertilize the selected tile, and ask server
        this.player.selectedTile = null;
      }
    }

    handleBuyEvent(e) {
      if(this.player.selectedTile != null && this.player.selectedTile.type === "empty" && this.player.money > this.player.selectedTile.cost) {
        //TODO: Buy the selected tile, and ask server
        this.player.selectedTile = null;
      }
    }

    handleCanvasClick(e) {
      let pos = this.getMousePosition(e);
      let col = Math.floor(this.x / this.columns);
      let row = Math.floor(this.y / this.rows);
      let tile = this.farm.tiles[col][row];

      this.player.setSelectedTile(tile);
      this.ui_manager.updateActions(tile.getAvailableActions());
    }

    setPlayerList(player_list) {
      if(Array.isArray(player_list)) {
        this.player_list = player_list;
      }
    }

    addPlayer(player) {
      this.player_list.push(player);
    }

    getMousePosition(e) {
      var rect = this.canvas.getBoundingClientRect();
    	return {
    		x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*this.canvas.width),
    		y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*this.canvas.height)
    	};
    }
  }

  window.Game = Game;
})();
