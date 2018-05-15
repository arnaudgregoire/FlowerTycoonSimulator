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
    constructor(websocket, user_config) {
      let config = user_config || {};

      this.websocket = websocket;

      this.container = null;
      this.canvas_id = config.canvasID || "canvas";
      this.canvas = null;
      this.ctx = null;

      this.ui_manager = null;

      this.columns = config.columns || 10;
      this.rows = config.rows || 10;
      this.TILE_SIZE = 40;
      this.width = this.TILE_SIZE * this.columns;
      this.height = this.TILE_SIZE * this.rows;

      this.player_list = [];
      this.player = null;
      this.farm = null;

      this.then = 0;
      this.now = 0;
    }

    init() {
      this.canvas = document.getElementById(this.canvas_id);
      this.container = this.canvas.parentElement;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.textAlign = "center";
  		this.ctx.textBaseline = "middle";

      this.ui_manager = new UIManager();

      this.farm = new Farm(this.columns, this.rows, this.tile_size);

      this.resizeCanvas();

      this.initEventListener();

      // AssetLoader.load([ ]);
  		// ResourcesLoader.onReady(function(){
  		// 	this.then = Date.now();
  		// 	this.run();
  		// }.bind(this));

      this.then = Date.now();
      requestAnimFrame(this.loop.bind(this));
    }

    initEventListener() {
      window.addEventListener("resize", function () {
  			this.resizeCanvas();
  		}.bind(this), false);

      window.addEventListener("sendLogin", function (e) {
        this.tryLogin(e.detail);
      }.bind(this), false);

      this.canvas.addEventListener("click", function (e) {
        this.handleCanvasClick();
      }.bind(this), false);

      window.addEventListener("plantEvent", function (e) {
        if(this.player.selectedTile != null && this.player.selectedItem != null) {
          //TODO: Plant a new flower on the selected tile, and ask server
          this.player.selectedTile = null;
          this.player.selectedItem = null;
        }
      }, false);
      window.addEventListener("harvestEvent", function (e) {
        if(this.player.selectedTile != null) {
          //TODO: Harvest the selected tile, and ask server
          this.player.selectedTile = null;
        }
      }, false);
      window.addEventListener("fertilizeEvent", function (e) {
        if(this.player.selectedTile != null) {
          //TODO: Fertilize the selected tile, and ask server
          this.player.selectedTile = null;
        }
      }, false);
      window.addEventListener("buyEvent", function (e) {
        if(this.player.selectedTile != null) {
          //TODO: Fertilize the selected tile, and ask server
          this.player.selectedTile = null;
        }
      }, false);

      window.addEventListener("inventoryEvent", function (e) {
        let item_id = e.detail.id;
        if(this.player.hasItem(item_id)) {
          this.player.setSelectedItem(item_id);
        }
      }, false);
    }

    loop() {
      this.now = Date.now();
      update(this.now - this.then);
      this.then = Date.now();

      this.draw();
      requestAnimFrame(this.loop.bind(this));
    }

    update(dt) {
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].update(dt);
      }
      this.farm.update(dt);
    }

    draw() {
      this.farm.draw(this.ctx);
    }

    resizeCanvas() {
      let w = this.container.clientWidth;
      let h = this.container.clientHeight;

      let style = window.getComputedStyle(this.container, null);
      h -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      w -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

      let screenHeight, screenWidth;
      if(w/h > this.gameWidth/this.gameHeight) {   // get the best game ratio
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

    tryLogin(info) {
      console.log(info);
      // TODO: implement login logic here
      // let success = send(...)

      let success = true;
      if(success) {
        game = new Game()
        player = new Player();
        farm = new Farm();

        uiManager.setUsername(info.username);
      }
    }

    setCurrentPlayer(player) {
      this.player = player;
    }

    setPlayerList(player_list) {
      this.player_list = player_list;
    }

    addPlayer(player) {
      this.player_list.push(player);
    }

    handleCanvasClick(e) {
      let pos = this.getMousePosition(e);
      let col = Math.floor(this.x / this.columns);
      let row = Math.floor(this.y / this.rows);
      this.player.setSelectedTile(col, row);
    }

    getMousePosition(e) {
      var rect = this.canvas.getBoundingClientRect();
    	return {
    		x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*this.canvas.width),
    		y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*this.canvas.height)
    	};
    }
  }
})
