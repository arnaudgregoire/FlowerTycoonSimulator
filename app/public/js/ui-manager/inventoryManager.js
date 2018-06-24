(function () {
    "use strict";
  
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
    window.InventoryManager = InventoryManager;
})()    