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
      while (!!this.container.firstElementChild) {
        this.container.removeChild(this.container.firstElementChild);
      }
    }
  }

  class InventoryManager extends IManager {
    constructor(doc, container) {
      super(doc, container);
      this.money = 0;
  		this.inventory = [];

      this.inventoryHTML = this.doc.createElement("ul");
      this.container.appendChild(this.inventoryHTML);
    }
  }

  class ActionsManager extends IManager {
    constructor(doc, container) {
      super(doc, container);

      this.plant_button = this.doc.querySelector("#plant-button");
      this.harvest_button = this.doc.querySelector("#harvest-button");
      this.fertilize_button = this.doc.querySelector("#fertilize-button");
      this.buy_button = this.doc.querySelector("#buy-button");

      this.plant_button.addEventListener("click", function(){
        player.planter(player);
      });
      this.buy_button.addEventListener("click", function(){
        player.acheter(player);
      });
    }
  }

  class BoardManager extends IManager {
    constructor(doc, container) {
      super(doc, container);
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
    displayInfo(msg) {
      this.infoManager.displayInfo(msg);
    }

    clearInfo() {
      this.infoManager.clearInfo();
    }
  }

  window.UIManager = UIManager;
})();
