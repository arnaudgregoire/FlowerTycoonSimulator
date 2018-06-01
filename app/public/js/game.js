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

      this.width = 0;
      this.height = 0;

      this.server_url = config.url || "";
      this.socket_manager = null;
      this.ui_manager = null;

      this.farm = null;
      this.player_list = null;
      this.player = null;

      this.refresh_rate = 1000; // every refresh_rate second, the canvas is actualised with client data 
    }

    init() {
      this.canvas = document.getElementById(this.canvas_id);
      this.container = this.canvas.parentElement;
      this.ctx = this.canvas.getContext("2d");
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      this.farm = null;
      this.player_list = [];
      this.socket_manager = new SocketManager(this.server_url);
      this.ui_manager = new UIManager();
      this.initEventListener();

      ImgLoader.setMainDirectory("public/assets/");
      ImgLoader.load([
        {"grass": "tile/grass.png"},
        {"dirt": "tile/dirt.png"},
        {"plant": "flower/plant.png"},
        {"rose": "flower/rose.png"},
        {"tulip": "flower/tulip.png"},
        {"seed": "seed/seed.png"}
      ],
        () => this.ui_manager.toggleLogin());
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
      }.bind(this), false);

      window.addEventListener("harvestClick", function (e) {
        this.handleHarvestEvent(e);
      }.bind(this), false);

      window.addEventListener("fertilizeClick", function (e) {
        this.handleFertilizeEvent(e);
      }.bind(this), false);

      window.addEventListener("buyClick", function (e) {
        this.handleBuyEvent(e);
      }.bind(this), false);

      window.addEventListener("inventoryClick", function (e) {
        let item_id = e.detail.id;
        if(this.player.hasItem(item_id)) {
          this.player.setSelectedItem(item_id);
        }
      }.bind(this), false);

      window.addEventListener("updateGame", function () {
        this.update();
      }.bind(this), false);

      window.addEventListener("displayInfo", function (e) {
        this.ui_manager.displayInfo(e.detail);
      }.bind(this), false);
    }


    checkID(id){
      for (var i = 0; i < this.player_list.length; i++) {
        if (this.player_list[i].id == id) {
          return true;
        }
      }
      return false;
    }

    /**
    * Renvoie le joeur correspondant au nom compris dans la requete
    * @param {Request body} req
    */
    findPlayerById(id){
      for (var i = 0; i < this.player_list.length; i++) {
        if (this.player_list[i].id == id) {
          return this.player_list[i];
        }
      }
      return null;
    }

    update() {
      if(this.player != null){
        this.getPlayers();
        this.getFarm();
        this.getInventory();
      }
    }

    updateFarm(dt){
      this.farm.update(dt);
      this.farm.draw(this.ctx);
    }

    getFarm(){
      this.socket_manager.sendMessage("getFarm", JSON.stringify({"description" : "getFarm"}))
      .then((json)=>{
        this.farm.updateTiles(json.tiles,this);
        //console.log(this.farm.tiles);
        this.farm.draw(this.ctx);
      })
    }

    getPlayers(){
      this.socket_manager.sendMessage('getPlayers',JSON.stringify({"description" : "getPlayers"}))
      .then((json) =>{
        this.player_list = [];
        //console.log(json);
        for (let i = 0; i < json.players.length; i++) {
          this.player_list.push(new Player(json.players[i].id, json.players[i].username, json.players[i].color));
        }
        this.ui_manager.updateBoard(this.player_list);
      });
    }

    getInventory(){
      this.socket_manager.sendMessage('getInventory', JSON.stringify(
        {
          "description" : "getInventory",
          "param":{
            "player" : {
              "id": this.player.id
            }
          }
        }
      )).then((json)=>{
        //console.log(json);
        this.player.inventory = [];
        for (let i = 0; i < json.inventory.length; i++) {
          switch(json.inventory[i].category){
            case "plant":
              this.player.inventory.push(window.PlantFactory.prototype.createPlantFromData(json.inventory[i]));
              break;
            
            case "seed":
              this.player.inventory.push(window.SeedFactory.prototype.createSeedFromData(json.inventory[i]));
              break;
          }          
        }
        this.player.money = json.money;
        this.ui_manager.updateInventory(this.player);
      });
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
      this.canvas.style.marginTop = String(0.5 * (h - screenHeight))+"px";
    }

    handleLogin(info) {
      //console.log(info);
      this.socket_manager.sendMessage("login",JSON.stringify(
        {
          "description": "login",
          "param": info
        }
        ))
        .then((res)=>{
          //console.log(res);
          let success = res.response;
          if(success) {
            // this.width = this.canvas.width = this.TILE_SIZE * this.columns;
            // this.height = this.canvas.height = this.TILE_SIZE * this.rows;

            this.farm = new Farm(this.columns, this.rows);
            this.farm.setTileDimensions(100, 50);

            this.width = this.canvas.width = this.farm.getWidth() + 25;
            this.height = this.canvas.height = this.farm.getHeight() + 100;
            this.farm.setOffset(this.width*0.5, this.height*0.5-this.farm.getHeight()*0.5+30);


            this.player_list = [];
            this.player = new Player(res.player.id, res.player.name);
            //console.log(this.player);
            this.ui_manager.setInfo(this.player);

            this.resizeCanvas();
            this.ui_manager.toggleLogin();
            window.setInterval(function(){this.updateFarm(this.refresh_rate)}.bind(this), this.refresh_rate);
            this.update();
          }
        }
      );
    }


    handlePlantEvent(e) {
      if(this.player.selectedTile != null && this.player.selectedItem != null) {
        //TODO: Plant a new Plant on the selected tile, and ask server
        this.socket_manager.sendMessage("plant",JSON.stringify(
          {
            "description": "buy",
            "param": {
              "player": {"id": this.player.id},
              "tile":{
                "x": this.player.selectedTile.x,
                "y": this.player.selectedTile.y
              },
              "Plant":{
                "id": this.player.selectedItem.id
              }
            }
          }
        )).then((res)=>{
          console.log(res);
          this.player.selectedTile = null;
          this.player.selectedItem = null;
        })
      }
    }

    handleHarvestEvent(e) {
      if(this.player.selectedTile != null && this.player.selectedTile.type == "seeded") {
        this.socket_manager.sendMessage("harvest",JSON.stringify(
          {
            "description": "harvest",
            "param": {
              "player": {"id": this.player.id},
              "tile":{
                "x": this.player.selectedTile.x,
                "y": this.player.selectedTile.y
              }
            }
          }
        )).then(
          (res)=>{
            console.log(res);
          }
        )
      }
    }

    handleFertilizeEvent(e) {
      if(this.player.selectedTile != null) {
        //TODO: Fertilize the  selected tile, and ask server
        this.player.selectedTile = null;
      }
    }

    handleBuyEvent(e) {
      //console.log(this.player.selectedTile);
      if(this.player.selectedTile != null && this.player.selectedTile.type === "empty" && this.player.money > this.player.selectedTile.cost) {
        this.socket_manager.sendMessage("buy",JSON.stringify(
          {
            "description": "buy",
            "param": {
              "player": {"id": this.player.id},
              "tile":{
                "x": this.player.selectedTile.x,
                "y": this.player.selectedTile.y
              }
            }
          }
        )).then((res)=>{
          console.log(res);
          this.player.selectedTile = null;
        })
      }
    }

    handleCanvasClick(e) {
      let pos = this.getMousePosition(e);

      if(this.farm) {
        let tile = this.farm.selectTile(pos.x, pos.y);
        if(tile != null) {
          this.player.setSelectedTile(tile);
          this.ui_manager.updateActions(tile.getAvailableActions());
          this.farm.draw(this.ctx);
        }
      }
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
