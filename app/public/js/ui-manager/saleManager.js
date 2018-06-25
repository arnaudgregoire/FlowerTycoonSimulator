(function () {
    "use strict";
  
 
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
          let titre = document.createElement("h2");
          titre.appendChild(document.createTextNode("Votre Boutique :"));
          saleBox.appendChild(titre);
          saleBox.appendChild(placeHolder);
          let sousTitre = document.createElement("h3");
          sousTitre.appendChild(document.createTextNode("Composez un des bouquets ci dessous en cliquant sur les fleurs de votre inventaire"));
          saleBox.appendChild(sousTitre);
          saleBox.appendChild(choiceBouqets);
          let buttonList = document.createElement("div");
          buttonList.classList.add("buttonList");
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
            flower.classList.add("item");
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
    window.SaleManager = SaleManager;
})()    