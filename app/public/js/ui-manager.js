(function () {
  "use strict";

  class IManager {
    constructor(container) {
      this.container = container;
    }

    dispatchUIEvent(event_name, event_data) {
      window.dispatchEvent( new CustomEvent(String(event_name), {
        detail: event_data
      }));
    }
  }

  class LoginManager extends IManager {
    constructor(container) {
      super(container);

      this.visible = false;
    }

    toggle() {
      if(this.visible) {
        this.visible = false;
        this.delete();
      }
      else {
        this.visible = true;
        this.create();
      }
    }

    create() {
      document.body.appendChild(this.getHTML());

      let button = document.querySelector("#login-button");
      button.addEventListener("click", function (e) {
        e.preventDefault();
        this.sendLogin();
      }.bind(this), false);
    }

    delete() {
      document.querySelector("#wrap").classList.remove("hidden");
      if(document.querySelector("#overlay") != null) {
        document.body.removeChild(document.querySelector("#overlay"));
      }
    }

    getHTML() {
      let overlay = document.createElement("div");
      overlay.id = "overlay";

      let form = document.createElement("form");
      form.method = "get";
      form.id = "login-box";
      form.innerHTML = "<div><p>Authentification</p></div> \
      <div><label for='login-username'>Pseudo</label><input type='text' id='login-name'></div> \
      <div><label for='login-paswd'>Mot de passe</label><input type='password' id='login-paswd'></div> \
      <div><input type='submit' value='Connexion' class='button' id='login-button'></div>";

      overlay.appendChild(form);
      return overlay;
    }

    /**
    * Send a new window event with the login info
    */
    sendLogin() {
      let username = document.querySelector("#login-name");
      let paswd = document.querySelector("#login-paswd");
      if(username != null && paswd != null) {
        username = username.value;
        paswd = paswd.value;
        // TODO: encode password, add verification with regex ?
        this.dispatchUIEvent("sendLogin", {
          username: username,
          password: paswd
        });
      }
    }
  }


  class UserManager extends IManager {
    constructor(container) {
      super(container);
      this.username = "";
      this.usernameHTML = document.createElement("p");
      this.container.appendChild(this.usernameHTML);

      this.setUsername("");
    }

    setUsername(name) {
      this.username = String(name);
      this.usernameHTML.textContent = String(name);
    }
  }

  class InfoManager extends IManager {
    constructor(container) {
      super(container);
    }

    displayInfo(msg) {
      let p = document.createElement("p");
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
    constructor(container) {
      super(container);
      this.player_id = null // keep track of the player id to avoid recreating the inventory
      this.money = 0;
  		this.inventory = [];

      this.moneyHTML = documentc.createElement("p");
      this.inventoryHTML = document.createElement("ul");

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
      let div = document.createElement("div");
      // TODO: put things in the div
      this.setEventListener(div);
      return div;
    }

    setEventListener(div) {
      div.addEventListener("click", function () {
        this.dispatchUIEvent("inventoryEvent", div.dataset.id);
      }.bind(this))
    }
  }


  class BoardManager extends IManager {
    constructor(container) {
      super(container);

      this.player_list = [];
    }

    /**
    * Go through the player list, and only update the HTML
    * if the list order has changed to boost performance
    */
    displayBoard(player_list) {
      let old_child, new_child;

      for (var i = 0; i < player_list.length; i++) {
        if(player_list[i].id != this.player_list[i].id) {

          old_child = this.findPlayerDiv(this.player_list[i].id);
          if(old_child == null) break; // the player is not on the leaderboard ???

          new_child = this.createHTML(player_list[i]);
          this.container.replaceChild(newChild, oldChild);
        }
      }
    }

    findPlayerDiv(id) {
      let childs = this.container.childNodes;
      for (var i = 0; i < childs.length; i++) {
        if(childs[i].dataset.id == id) {
          return childs[i];
        }
      }
      return null;
    }


    createHTML(player) {
      let div = document.createElement("div");
      // TODO: make a pretty div

      el.dataset.id = player.id;
      el.innerHtML = "<p>"+player.name+" ("+player.score+")</p>";
      return div;
    }
  }

  class ActionsManager extends IManager {
    constructor(container) {
      super(container);

      this.plant_button = document.querySelector("#plant-button");
      this.harvest_button = document.querySelector("#harvest-button");
      this.fertilize_button = document.querySelector("#fertilize-button");
      this.buy_button = document.querySelector("#buy-button");

      // All event are handled by the client game
      this.plant_button.addEventListener("click", function() {
        this.dispatchUIEvent("plantEvent", null);
      }.bind(this);

      this.harvest_button.addEventListener("click", function(){
        this.dispatchUIEvent("harvestEvent", null);
      }.bind(this);

      this.fertilize_button.addEventListener("click", function(){
        this.dispatchUIEvent("fertilizeEvent", null);
      }.bind(this);

      this.buy_button.addEventListener("click", function(){
        this.dispatchUIEvent("buyEvent", null);
      }.bind(this);
    }
  }



  class UIManager {
    constructor() {
      this.loginManager     = null;
      this.userManager      = null;
      this.infoManager      = null;
      this.inventoryManager = null;
      this.actionsManager   = null;
      this.boardManager     = null;

      this.init();
    }

    init() {
      this.loginManager     = new UserManager(document);
      this.userManager      = new UserManager(document.querySelector("#user-info"));
      this.infoManager      = new InfoManager(document.querySelector("#click-info"));
      this.inventoryManager = new InventoryManager(document.querySelector("#inventory"));
      this.actionsManager   = new ActionsManager(document.querySelector("#actions"));
      this.boardManager     = new BoardManager(document.querySelector("#leaderboard"));
    }

    /**
    * Wrap common child method for a quicker access
    */
    toggleLogin() {
      this.loginManager.toggle();
    }

    setUsername(name) {
      this.userManager.setUsername(name);
    }

    displayInfo(msg) {
      this.infoManager.displayInfo(msg);
    }

    clearInfo() {
      this.infoManager.clearInfo();
    }

    displayInventory(player) {
      this.inventoryManager.displayInventory(player);
    }

    displayMoney(player) {
      this.inventoryManager.displayMoney(player);
    }
  }

  window.UIManager = UIManager;
})();
