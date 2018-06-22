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
      this.bouquets = [];
      this.initEventListener();

      ImgLoader.setMainDirectory("public/assets/");
      ImgLoader.load([
        {"grass": "tile/grass.png"},
        {"dirt": "tile/dirt.png"},
        {"plant": "flower/plant.png"},
        {"rose": "flower/rose.png"},
        {"tulip": "flower/tulip.png"},
        {"seed": "seed/seed.png"},
        {"plantOld": "flower/plantOld.png"}
      ], () => this.ui_manager.toggleLogin());
    }

    initEventListener() {
      window.addEventListener("resize", function () {
  			this.resizeCanvas();
  		}.bind(this), false);

      window.addEventListener("sendLogin", function (e) {
        this.handleLogin(e.detail);
      }.bind(this), false);

      window.addEventListener("sendRegistration", function(e){
        this.handleRegistration(e.detail);
      }.bind(this),false);

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
        
        if(this.ui_manager.saleManager.visible && document.getElementById('dropzone').childNodes.length < 4 && this.player.selectedItem.category == "plant"){
          if(this.player.selectedItem.bloomed){
            this.player.removeItem(this.player.selectedItem);
            let itemHTML = this.ui_manager.saleManager.createItemHTML(this.player.selectedItem);
            this.player.saleInventory.push(this.player.selectedItem);
            document.getElementById("dropzone").appendChild(itemHTML);
            this.ui_manager.inventoryManager.displayInventory(this.player);
          }
        }
      }.bind(this), false);

      window.addEventListener("inventorySaleClick", function (e) {
        this.handleInventorySaleClick(e);
      }.bind(this), false);

      window.addEventListener("closeSaleClick", function (e) {
        this.handlecloseSaleClick(e);
      }.bind(this), false);

      window.addEventListener("saleBouquetClick", function (e) {
        this.handlesaleBouquetClick(e);
      }.bind(this), false);

      window.addEventListener("updateGame", function () {
        this.update();
      }.bind(this), false);

      window.addEventListener("displayInfo", function (e) {
        this.ui_manager.displayInfo(e.detail);
      }.bind(this), false);

      window.addEventListener("saleClick", function (e) {
        this.handleSaleEvent(e);
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
        this.getBouquets();
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

    getBouquets(){
      this.socket_manager.sendMessage("getBouquets", JSON.stringify({"description" : "getBouquets"}))
      .then((json)=>{
        this.bouquets = [];
        for (let i = 0; i < json.length; i++) {
          let arrayFlower = [];
          for (let j = 0; j < json[i].arrayFlower.length; j++) {
            arrayFlower.push(PlantFactory.prototype.createPlantFromData(json[i].arrayFlower[j]));
          }
          this.bouquets.push(new Bouquet(arrayFlower));
        }
      })
    }

    getPlayers(){
      this.socket_manager.sendMessage('getPlayers',JSON.stringify({"description" : "getPlayers"}))
      .then((json) =>{
        this.player_list = [];
        console.log(json);
        for (let i = 0; i < json.players.length; i++) {
          this.player_list.push(new Player(json.players[i].id, json.players[i].username, json.players[i].color, json.players[i].score));
        }
        this.ui_manager.updateBoard(this.player_list);
        this.player = this.findPlayerById(this.player.id);
        this.ui_manager.setInfo(this.player);
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

    handleRegistration(info){
      console.log(info);
      this.socket_manager.sendMessage("register",JSON.stringify(
        {
          "description": "register",
          "param": info
        }
        ))
        .then((res)=>{
          console.log("info registration");
          let success = res.response;
          console.log(res);
          if(success) {
            console.log("registration successful")
          }
        }
      );
    }


    handleLogin(info) {
      console.log(info);
      this.socket_manager.sendMessage("login",JSON.stringify(
        {
          "description": "login",
          "param": info
        }
        ))
        .then((res)=>{
          console.log("info2");
          let success = res.response;
          console.log(res);
          console.log("info3")
          if(success) {
            // this.width = this.canvas.width = this.TILE_SIZE * this.columns;
            // this.height = this.canvas.height = this.TILE_SIZE * this.rows;

            this.farm = new Farm(this.columns, this.rows);
            this.farm.setTileDimensions(100, 50);

            this.width = this.canvas.width = this.farm.getWidth() + 25;
            this.height = this.canvas.height = this.farm.getHeight() + 100;
            this.farm.setOffset(this.width*0.5, this.height*0.5-this.farm.getHeight()*0.5+30);


            this.player_list = [];
            this.player = new Player(res.player.id, res.player.name,0);
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

    handleSaleEvent(e){
      this.ui_manager.toggleSale(this.bouquets);
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

    handleInventorySaleClick(e){
      let item_id = e.detail.id;
      if(this.player.hasItemInSaleInventory(item_id)) {
        this.player.selectedItem = this.player.findItemInSaleInventory(item_id);
      }
      this.player.inventory.push(this.player.selectedItem);
      this.player.removeItemFromSaleInventory(this.player.selectedItem);

      document.getElementById("dropzone").removeChild(e.detail);
      this.ui_manager.inventoryManager.displayInventory(this.player);
    }

    handlecloseSaleClick(e){
      for (let i = 0; i < this.player.saleInventory.length; i++) {
        this.player.inventory.push(this.player.saleInventory[i]);
      }
      while (document.getElementById('dropzone').firstChild) {
        document.getElementById('dropzone').removeChild(document.getElementById('dropzone').firstChild);
      }
      this.player.saleInventory= [];
      this.ui_manager.inventoryManager.displayInventory(this.player);
      this.ui_manager.saleManager.toggle();
    }

    handlesaleBouquetClick(e){
      if(this.player.saleInventory.length == 4){
        let bouquet = new Bouquet(this.player.saleInventory);
        if(bouquet.isValid(this.bouquets)){
          
          this.socket_manager.sendMessage("sell",JSON.stringify(
            {
              "description": "sell",
              "param": {
                "player": {"id": this.player.id},
                "bouquet":{"arrayFlower": bouquet.arrayFlower}
              }
            }
          )).then((res)=>{
            console.log(res);
            if(res.response == 1){
              this.getInventory();
              while (document.getElementById('dropzone').firstChild) {
                document.getElementById('dropzone').removeChild(document.getElementById('dropzone').firstChild);
              }
              this.player.saleInventory= [];
            }
            this.player.selectedTile = null;
          })
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
