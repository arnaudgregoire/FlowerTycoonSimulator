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

      let buttonLogin = document.querySelector("#login-button");
      buttonLogin.addEventListener("click", function (e) {
        e.preventDefault();
        this.sendLogin();
      }.bind(this), false);

      let buttonRegister = document.querySelector("#register-button");
      buttonRegister.addEventListener("click", function(e){
        e.preventDefault();
        this.sendRegistration();
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
      <div><input type='submit' value='Connexion' class='button' id='login-button'></div> \
      <div><p>Registration</p></div> \
      <div><label for='login-username'>Pseudo</label><input type='text' id='register-name'></div> \
      <div><label for='login-paswd'>Mot de passe</label><input type='password' id='register-paswd'></div> \
      <div><input type='submit' value='Creer un compte' class='button' id='register-button'></div>";

      overlay.appendChild(form);
      return overlay;
    }

    /**
    * Send a new window event with the login info
    */
    sendRegistration(){
      console.log("sendregistration");
      let username = document.querySelector("#register-name");
      let paswd = document.querySelector("#register-paswd");
      if(username != null && paswd != null) {
        username = username.value;
        paswd = paswd.value;
        // TODO: encode password, add verification with regex ?
        this.dispatchUIEvent("sendRegistration", {
          player: {
            username: username,
            password: paswd,
          }
        });
      }
    }


    sendLogin() {
      let username = document.querySelector("#login-name");
      let paswd = document.querySelector("#login-paswd");
      if(username != null && paswd != null) {
        username = username.value;
        paswd = paswd.value;
        // TODO: encode password, add verification with regex ?
        this.dispatchUIEvent("sendLogin", {
          player: {
            username: username,
            password: paswd,
          }
        });
      }
    }

  }


  class UserManager extends IManager {
    constructor(container) {
      super(container);
      this.usernameHTML = document.createElement("p");
      this.scoreHTML = document.createElement("p");
      this.container.appendChild(this.usernameHTML);
      this.container.appendChild(this.scoreHTML);
    }

    setPlayerInfo(player) {
      this.setUsername(player.name);
      this.setPlayerScore(player.score);
    }

    setUsername(name) {
      this.usernameHTML.textContent = String(name);
    }

    setPlayerScore(score) {
      this.scoreHTML.textContent = "Score: " + String(score);
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
      this.inventoryHTML.id = "arrayInventory";
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
      this.moneyHTML.innerText = String(player.money) + "G";
    }

    clearInventory() {
      while (this.inventoryHTML.firstChild) {
        this.inventoryHTML.removeChild(this.inventoryHTML.firstChild);
      }
    }

    createHTML(item) {
      //console.log(item);
      let div = document.createElement("li");
      let miniature = document.createElement("img");
      miniature.src = item.getAsset().src;
      div.appendChild(miniature);
      let nameContainer = document.createElement("p");
      nameContainer.innerHTML = item.category + " " + item.name;
      div.appendChild(nameContainer);
      div.setAttribute("id",item.id);
      div.classList.add("item");
      this.setEventListener(div);
      return div;
    }

    setEventListener(div) {
      div.addEventListener("click", function () {
        this.dispatchUIEvent("inventoryClick", div);
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
        if (!this.player_list[i]) {
          new_child = this.createHTML(player_list[i]);
          this.container.appendChild(new_child);
        }
        else if (this.player_list[i] && player_list[i].id !== this.player_list[i].id) {
          old_child = this.getPlayerDiv(this.player_list[i].name);
          if(old_child == null) break; // the player is not on the leaderboard ???

          new_child = this.createHTML(player_list[i]);
          this.container.replaceChild(newChild, oldChild);
        }
      }
    }

    displayBoardTemp(player_list){
      this.clearBoard();
      for (var i = 0; i < player_list.length; i++) {
          this.container.appendChild(this.createHTML(player_list[i]));
      }
    }

    clearBoard(){
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
    }

    getPlayerDiv(name) {
      if (this.container.hasChildNodes()) {
        for (var div of this.container.childNodes) {
          if (div.dataset.name === name) {
            return div;
          }
        }
      }
      return null;
    }


    createHTML(player) {
      let div = document.createElement("div");
      div.dataset.name = player.name;
      let p = document.createElement("p");
      p.innerText =  player.name + " " + player.score;
      p.style.color = player.color;
      div.appendChild(p);
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
      if (!!actions.plant) { this.plant_button.classList.remove("hidden") }
      else { this.plant_button.classList.add("hidden") }

      if (!!actions.harvest) { this.harvest_button.classList.remove("hidden") }
      else { this.harvest_button.classList.add("hidden") }

      if (!!actions.fertilize) { this.fertilize_button.classList.remove("hidden") }
      else { this.fertilize_button.classList.add("hidden") }

      if (!!actions.buy) { this.buy_button.classList.remove("hidden") }
      else { this.buy_button.classList.add("hidden") }
    }
  }

class SaleManager extends IManager{
  constructor(container){
    super(container);
    this.visible = false;
    container.addEventListener("click", function (){
      this.dispatchUIEvent("saleClick", null);
    }.bind(this), false);
  }

  toggle(bouquets) {
    if(this.visible) {
      this.visible = false;
      this.delete();
    }
    else {
      this.visible = true;
      this.create(bouquets);
    }
  }
  create(bouquets) {
    document.body.appendChild(this.getHTML(bouquets));
    document.getElementById('inventory').style.zIndex = '3';
  }

  delete() {
    document.querySelector("#wrap").classList.remove("hidden");
    if(document.querySelector("#sale-overlay") != null) {
      document.body.removeChild(document.querySelector("#sale-overlay"));
    }
    document.getElementById('inventory').style.removeProperty('zIndex');
  }

  getHTML(bouquets) {
    let overlay = document.createElement("div");
    overlay.id = "sale-overlay";
    let saleBox = document.createElement("div");
    saleBox.id = "sale-box";
    let choiceBouqets = document.createElement("div");
    choiceBouqets.id = "choiceBouquets";
    let placeHolder = document.createElement("div");
    placeHolder.id = "placeHolder";
    let dropzone = document.createElement("ul");
    dropzone.id = "dropzone";
    placeHolder.appendChild(dropzone);
    for (let i = 0; i < bouquets.length; i++) {
      choiceBouqets.appendChild(this.getBouquetHTML(bouquets[i])); 
    }
    let closeButton = document.createElement("div");
    closeButton.classList.add("button");
    closeButton.appendChild(document.createElement('p').appendChild(document.createTextNode("Fermer")));
    closeButton.addEventListener('click', function (){
      this.dispatchUIEvent("closeSaleClick",closeButton);
    }.bind(this), false)
    let saleButton = document.createElement("div");
    saleButton.classList.add("button");
    saleButton.appendChild(document.createElement('p').appendChild(document.createTextNode("Vendre")));
    saleButton.addEventListener('click', function (){
      this.dispatchUIEvent("saleBouquetClick",saleButton);
    }.bind(this), false)
    saleBox.appendChild(placeHolder);
    saleBox.appendChild(choiceBouqets);
    let buttonList = document.createElement("div");
    buttonList.id = "buttonList";
    buttonList.appendChild(closeButton);
    buttonList.appendChild(saleButton);
    saleBox.appendChild(buttonList);
    overlay.appendChild(saleBox);
    return overlay;
  }

  getBouquetHTML(bouquet){
    let bouquetContainer = this.getBouquetContainerHTML();
    for (let i = 0; i < bouquet.arrayFlower.length; i++) {
      let flower = document.createElement("li");
      let miniature = document.createElement("img");
      miniature.src = bouquet.arrayFlower[i].getAsset().src;
      flower.appendChild(miniature);
      let name = document.createElement("p");
      name.appendChild(document.createTextNode(bouquet.arrayFlower[i].name));
      flower.appendChild(name);
      bouquetContainer.appendChild(flower);
    }
    return bouquetContainer;
  }
  
  getBouquetContainerHTML(){
    let bouquetContainer = document.createElement("ul");
    bouquetContainer.classList.add("bouquet");
    return bouquetContainer;
  }

  createItemHTML(item) {
    //console.log(item);
    let div = document.createElement("li");
    let miniature = document.createElement("img");
    miniature.src = item.getAsset().src;
    div.appendChild(miniature);
    let nameContainer = document.createElement("p");
    nameContainer.innerHTML = item.category + " " + item.name;
    div.appendChild(nameContainer);
    div.setAttribute("id",item.id);
    div.classList.add("item");
    this.setEventListener(div);
    return div;
  }

  setEventListener(div) {
    div.addEventListener("click", function () {
      this.dispatchUIEvent("inventorySaleClick", div);
    }.bind(this))
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
      this.saleManager      = null;

      this.init();
    }

    init() {
      this.loginManager     = new LoginManager(null);
      this.userManager      = new UserManager(document.querySelector("#user-info"));
      this.infoManager      = new InfoManager(document.querySelector("#click-info"));
      this.inventoryManager = new InventoryManager(document.querySelector("#inventory"));
      this.actionsManager   = new ActionsManager(document.querySelector("#actions"));
      this.boardManager     = new BoardManager(document.querySelector("#leaderboard"));
      this.saleManager      = new SaleManager(document.querySelector("#sale"));
    }

    updateBoard(player_list) {
      //this.boardManager.displayBoard(player_list);
      this.boardManager.displayBoardTemp(player_list);
    }

    updateInventory(player) {
      this.inventoryManager.displayInventory(player);
      this.inventoryManager.displayMoney(player);
    }

    updateActions(actions) {
      this.actionsManager.setButtonState(actions);
    }

    displayInfo(msg){
      this.infoManager.clearInfo();
      this.infoManager.displayInfo(msg);
    }
    /**
    * Wrap common child method for a quicker access
    */
    toggleLogin() {
      this.loginManager.toggle();
    }

    toggleSale(bouquets){
      this.saleManager.toggle(bouquets);
    }

    setInfo(player) {
      this.userManager.setPlayerInfo(player);
    }

  }

  window.UIManager = UIManager;
})();
