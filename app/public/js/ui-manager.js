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
      this.usernameHTML = document.createElement("p");
      this.container.appendChild(this.usernameHTML);
    }

    setPlayerInfo(player) {
      this.setUsername(player.name);
    }

    setUsername(name) {
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

      this.moneyHTML = document.createElement("p");
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
        for (var i = 0; i < player.inventory.length; i++) {
          this.inventoryHTML.appendChild( this.createHTML(player.inventory[i]) );
        }
      }
    }

    displayMoney(player) {
      this.moneyHTML.innerText = String(player.money);
    }

    clearInventory() {
      while (!!this.inventoryHTML.firstChild) {
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
        this.dispatchUIEvent("inventoryClick", div.dataset.id);
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

    displayBoardTemp(player_list){
      this.clearBoard();
      this.player_list = [];
      let child;
      for (let i = 0; i < player_list.length; i++) {
        child = this.createHTML(player_list[i]);
        this.container.appendChild(child);
      }
    }

    clearBoard(){
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
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
      div.appendChild(
        document.createElement("p").appendChild(
          document.createTextNode(player.name)
        )
      )
      // TODO: make a pretty div
      //el.dataset.id = player.id;
      //div.innerHtML = "<p>"+player.name+" ("+player.score+")</p>";
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
        this.dispatchUIEvent("plantClick", null);
      }.bind(this), false);

      this.harvest_button.addEventListener("click", function(){
        this.dispatchUIEvent("harvestClick", null);
      }.bind(this), false);

      this.fertilize_button.addEventListener("click", function(){
        this.dispatchUIEvent("fertilizeClickt", null);
      }.bind(this), false);

      this.buy_button.addEventListener("click", function(){
        this.dispatchUIEvent("buyClick", null);
      }.bind(this), false);
    }

    setButtonState(actions) {
      if (!!actions.plant) { this.plant_button.classList.remove("inactive") }
      else { this.plant_button.classList.add("inactive") }

      if (!!actions.harvest) { this.harvest_button.classList.remove("inactive") }
      else { this.harvest_button.classList.add("inactive") }

      if (!!actions.fertilize) { this.fertilize_button.classList.remove("inactive") }
      else { this.fertilize_button.classList.add("inactive") }

      if (!!actions.buy) { this.buy_button.classList.remove("inactive") }
      else { this.buy_button.classList.add("inactive") }
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
      this.loginManager     = new LoginManager(null);
      this.userManager      = new UserManager(document.querySelector("#user-info"));
      this.infoManager      = new InfoManager(document.querySelector("#click-info"));
      this.inventoryManager = new InventoryManager(document.querySelector("#inventory"));
      this.actionsManager   = new ActionsManager(document.querySelector("#actions"));
      this.boardManager     = new BoardManager(document.querySelector("#leaderboard"));
    }

    updateBoard(player_list) {
      this.boardManager.displayBoardTemp(player_list);
    }

    updateInventory(player) {
      this.inventoryManager.displayInventory(player);
      this.inventoryManager.displayMoney(player);
    }

    updateActions(actions) {
      this.actionsManager.setButtonState(actions);
    }

    /**
    * Wrap common child method for a quicker access
    */
    toggleLogin() {
      this.loginManager.toggle();
    }

    setInfo(player) {
      this.userManager.setPlayerInfo(player);
    }

    displayInfo(msg) {
      this.infoManager.displayInfo(msg);
    }

    clearInfo() {
      this.infoManager.clearInfo();
    }
  }

  window.UIManager = UIManager;
})();