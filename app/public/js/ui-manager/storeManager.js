(function () {
    "use strict";
  
    class StoreManager extends IManager {
        constructor(container) {
          super(container);
          this.visible = false;
          container.addEventListener("click", function (){
            this.dispatchUIEvent("storeClick", null);
          }.bind(this), false);
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
            document.getElementById('inventory').style.zIndex = '3';
        }

        delete() {
            document.querySelector("#wrap").classList.remove("hidden");
            if(document.querySelector("#store-overlay") != null) {
              document.body.removeChild(document.querySelector("#store-overlay"));
            }
            document.getElementById('inventory').style.removeProperty('zIndex');
          }
        
        getHTML(){
            let overlay = document.createElement("div");
            overlay.id = "store-overlay";

            let storeBox = document.createElement("div");
            storeBox.id = "store-box";

            let purchaseBox = document.createElement("div");
            purchaseBox.id = "purchase-box";

            let species = window.PlantSpecies.getSpecies();

            for (let i = 0; i < species.length; i++) {
                purchaseBox.appendChild(this.createItemHTML(window.SeedFactory.prototype.createSeedFromData({"name": species[i], "id": 0})));
            }

            let closeButton = document.createElement("div");
            closeButton.classList.add("button");
            closeButton.appendChild(document.createElement('p').appendChild(document.createTextNode("Fermer")));
            closeButton.addEventListener('click', function (){
              this.dispatchUIEvent("closeStore",closeButton);
            }.bind(this), false)

            let buttonList = document.createElement("div");
            buttonList.classList.add("buttonList");

            let titre = document.createElement("h2");
            titre.appendChild(document.createTextNode("Bienvenue à Arnaudiland !"));
            
            let sousTitre = document.createElement("h3");
            sousTitre.appendChild(document.createTextNode("Le seul magasin où vous pouvez acheter les graines qui vous manquent."));

            buttonList.appendChild(closeButton);
            storeBox.appendChild(titre);
            storeBox.appendChild(sousTitre);
            storeBox.appendChild(purchaseBox);
            storeBox.appendChild(buttonList);
            overlay.appendChild(storeBox);
            return overlay;
        }

        createItemHTML(item) {
            let containerDiv = document.createElement("div");
            containerDiv.classList.add("storeItemContainer");
            let div = document.createElement("div");

            let miniature = document.createElement("img");
            miniature.src = item.getAsset().src;
            div.appendChild(miniature);

            let nameContainer = document.createElement("p");
            nameContainer.innerHTML = item.name + " (" + item.cost + "G)";
            div.appendChild(nameContainer);
            div.classList.add("item");

            let purchaseButton = document.createElement("div");
            purchaseButton.classList.add("storeButton");
            purchaseButton.classList.add('button');
            purchaseButton.addEventListener("click", function () {
                this.dispatchUIEvent("purchaseButtonClick", item);
              }.bind(this));
            purchaseButton.appendChild(document.createElement('p').appendChild(document.createTextNode("Acheter")))
            containerDiv.appendChild(div);
            containerDiv.appendChild(purchaseButton);

            return containerDiv;
        }

      }
    window.StoreManager = StoreManager;
})()    