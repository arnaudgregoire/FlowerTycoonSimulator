(function () {
  "use strict";

  class IManager {
    constructor(doc, container) {
      this.doc = doc;
      this.container = container;
    }
  }


  class UserManager extends IManager {
    constructor(doc, container) {
      super(doc, container);
      this.username = "";
      this.usernameHTML = this.doc.createElement("p");
      this.container.appendChild(this.usernameHTML);

      this.setUsername("");
    }

    setUsername(name) {
      this.username = String(name);
      this.usernameHTML.textContent = String(name);
    }
  }

  class InfoManager extends IManager {
    constructor(doc, container) {
      super(doc, container);
    }

    displayInfo(msg) {
      let p = this.doc.createElement("p");
      p.classList.add("info-text");
      p.textContent = String(msg);
      this.container.appendChild(p);
    }

    clearInfo() {
      while (!!this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }
  }

  class InventoryManager extends IManager {
    constructor(doc, container) {
      super(doc, container);
      this.player_id = null // keep track of the player id to avoid recreating the inventory
      this.money = 0;
  		this.inventory = [];

      this.moneyHTML = this.doc.createElement("p");
      this.inventoryHTML = this.doc.createElement("ul");

      this.container.appendChild(this.moneyHTML);
      this.container.appendChild(this.inventoryHTML);
    }

    displayInventory(player) {
      if(!!this.player_id && this.player_id == player.id) {
        //TODO: update inventoryHTML by comparing values, and change only the modified item
      }
      else {
        this.clearInventory();
        for (var i = 0; i < player.getInventory.length; i++) {
          this.inventoryHTML.appendChild( this.createHTML(player.getInventory[i]) );
        }
      }
    }

    displayMoney(player) {
      this.moneyHTML.innerText = String(player.money);
    }

    clearInventory() {
      while (!!inventoryHTML.firstChild) {
        this.inventoryHTML.removeChild(inventoryHTML.firstChild);
      }
    }

    createHTML(item) {
      let el = this.doc.createElement("div");
      // TODO: put things in the div
      return div;
    }
  }


  class BoardManager extends IManager {
    constructor(doc, container) {
      super(doc, container);

      this.player_list = [];
    }

    displayBoard(player_list) {
      let old_child, new_child;

      for (var i = 0; i < player_list.length; i++) {
        if(player_list[i].id != this.player_list[i].id) {

          old_child = this.findPlayerById(this.player_list[i].id);
          if(old_child == null) break;

          new_child = this.createHTML(player_list[i]);
          this.container.replaceChild(newChild, oldChild);
        }
      }
    }

    findPlayerById(id) {
      let childs = this.container.childNodes;
      for (var i = 0; i < childs.length; i++) {
        if(childs[i].dataset.id == id) {
          return childs[i];
        }
      }
      return null;
    }


    createHTML(player) {
      // TODO: make a pretty div
      let div = this.doc.createElement("div");
      el.dataset.id = player.id;
      el.innerHtML = "<p>"+player.name+" - "+player.score+"</p>";
      return div;
    }
  }

  class ActionsManager extends IManager {
    constructor(doc, container) {
      super(doc, container);

      this.plant_button = this.doc.querySelector("#plant-button");
      this.harvest_button = this.doc.querySelector("#harvest-button");
      this.fertilize_button = this.doc.querySelector("#fertilize-button");
      this.buy_button = this.doc.querySelector("#buy-button");

      // TODO: Event will be later handled by the client game instance
      this.plant_button.addEventListener("click", function() {
        this.dispatchClickEvent("plantEvent", null);
      });
      this.harvest_button.addEventListener("click", function(){
        this.dispatchClickEvent("harvestEvent", null);
      });
      this.fertilize_button.addEventListener("click", function(){
        this.dispatchClickEvent("fertilizeEvent", null);
      });
      this.buy_button.addEventListener("click", function(){
        this.dispatchClickEvent("buyEvent", null);
      });
    }

    dispatchClickEvent(event_name, detail) {
      window.dispatchEvent(
        new CustomEvent(String(event_name), {
          detail: detail
        })
      );
    }
  }



  class UIManager {
    constructor(doc) {
      this.document = doc;

      this.userManager = null;
      this.infoManager = null;
      this.inventoryManager = null;
      this.actionsManager = null;
      this.boardManager = null;

      this.init();
    }

    init() {
      this.userManager = new UserManager(this.document, this.document.querySelector("#user-info"));
      this.infoManager = new InfoManager(this.document, this.document.querySelector("#click-info"));
      this.inventoryManager = new InventoryManager(this.document, this.document.querySelector("#inventory"));
      this.actionsManager = new ActionsManager(this.document, this.document.querySelector("#actions"));
      this.boardManager = new BoardManager(this.document, this.document.querySelector("#leaderboard"));
    }

    /**
    * Wrap common child method for a quicker access
    */
    setUsername(name) {
      this.userManager.setUsername(name);
    }

    displayInfo(msg) {
      this.infoManager.displayInfo(msg);
    }

    clearInfo() {
      this.infoManager.clearInfo();
    }

    clearInventory(player) {
      this.inventoryManager.displayInventory(player);
    }

    displayMoney(player) {
      this.inventoryManager.displayMoney(player);
    }
  }

  window.UIManager = UIManager;
})();
